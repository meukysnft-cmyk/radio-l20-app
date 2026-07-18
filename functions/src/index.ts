import * as admin from 'firebase-admin'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'

admin.initializeApp()

const db = admin.firestore()
const messaging = admin.messaging()

type NotificationDoc = {
  title: string
  body: string
  url: string
  imageUrl?: string
}

type NotificationTokenDoc = {
  token: string
  uid: string
  active: boolean
}

const BATCH_SIZE = 500

export const sendNotification = onDocumentCreated(
  'notifications/{notificationId}',
  async (event) => {
    const data = event.data?.data() as NotificationDoc | undefined
    if (!data) return

    const { title, body, url, imageUrl } = data

    const tokensSnap = await db
      .collection('notificationTokens')
      .where('active', '==', true)
      .get()

    if (tokensSnap.empty) return

    const tokens = tokensSnap.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as NotificationTokenDoc) }))
      .filter((t) => t.token)

    if (tokens.length === 0) return

    const message: admin.messaging.MulticastMessage = {
      tokens: tokens.map((t) => t.token),
      notification: {
        title,
        body,
        ...(imageUrl ? { imageUrl } : {}),
      },
      webpush: {
        fcmOptions: {
          link: url || '/',
        },
        notification: {
          icon: '/l20-icon.svg',
          badge: '/favicon.svg',
          tag: 'radio-l20',
          renotify: true,
        },
      },
      data: {
        url: url || '/',
      },
    }

    const response = await messaging.sendEachForMulticast(message)

    const invalidTokens: string[] = []

    response.responses.forEach((resp, index) => {
      if (!resp.success) {
        const error = resp.error
        if (
          error?.code === 'messaging/registration-token-not-registered' ||
          error?.code === 'messaging/invalid-registration-token'
        ) {
          invalidTokens.push(tokens[index].token)
        }
      }
    })

    if (invalidTokens.length > 0) {
      const batch = db.batch()
      for (const token of invalidTokens) {
        const snap = await db
          .collection('notificationTokens')
          .where('token', '==', token)
          .get()
        snap.docs.forEach((doc) => {
          batch.update(doc.ref, { active: false, updatedAt: admin.firestore.FieldValue.serverTimestamp() })
        })
      }
      await batch.commit()
    }
  },
)

export { sendDailyHoroscopeNotifications } from './horoscopeNotifications'

import * as admin from 'firebase-admin'
import { onSchedule } from 'firebase-functions/v2/scheduler'

const db = admin.firestore()
const messaging = admin.messaging()

export const sendDailyHoroscopeNotifications = onSchedule({
  schedule: 'every 60 minutes',
  timeZone: 'America/Maceio',
}, async () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const currentTime = `${hours}:${minutes}`
  const today = now.toISOString().slice(0, 10)

  const usersSnap = await db.collection('userProfiles')
    .where('horoscopeNotification', '==', true)
    .where('horoscopeNotificationTime', '==', currentTime)
    .where('birthday', '!=', null)
    .get()

  if (usersSnap.empty) return

  const zodiacMap: Record<string, { name: string; startMonth: number; startDay: number; endMonth: number; endDay: number }> = {
    'Áries': { name: 'Áries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 20 },
    'Touro': { name: 'Touro', startMonth: 4, startDay: 21, endMonth: 5, endDay: 20 },
    'Gêmeos': { name: 'Gêmeos', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    'Câncer': { name: 'Câncer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    'Leão': { name: 'Leão', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    'Virgem': { name: 'Virgem', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    'Libra': { name: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    'Escorpião': { name: 'Escorpião', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    'Sagitário': { name: 'Sagitário', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
    'Capricórnio': { name: 'Capricórnio', startMonth: 12, startDay: 22, endMonth: 1, endDay: 20 },
    'Aquário': { name: 'Aquário', startMonth: 1, startDay: 21, endMonth: 2, endDay: 18 },
    'Peixes': { name: 'Peixes', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  }

  function getSign(birthday: string): string | null {
    const parts = birthday.split('/')
    if (parts.length !== 3) return null
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    for (const sign of Object.values(zodiacMap)) {
      if (sign.startMonth === sign.endMonth) {
        if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) return sign.name
      } else if (sign.startMonth > sign.endMonth) {
        if ((month === sign.startMonth && day >= sign.startDay) || (month === sign.endMonth && day <= sign.endDay)) return sign.name
      } else {
        if (month === sign.startMonth && day >= sign.startDay) return sign.name
        if (month === sign.endMonth && day <= sign.endDay) return sign.name
      }
    }
    return null
  }

  const tokensSnap = await db.collection('notificationTokens')
    .where('active', '==', true)
    .get()

  const tokensByUid = new Map<string, string[]>()
  for (const doc of tokensSnap.docs) {
    const data = doc.data()
    if (!data.token || !data.uid) continue
    const existing = tokensByUid.get(data.uid) || []
    existing.push(data.token)
    tokensByUid.set(data.uid, existing)
  }

  let sentCount = 0

  for (const userDoc of usersSnap.docs) {
    const userData = userDoc.data()
    const birthday = userData.birthday as string
    const displayName = userData.displayName as string || 'ouvinte'
    const signName = getSign(birthday)
    if (!signName) continue

    const predSnap = await db.collection('horoscopePredictions')
      .where('date', '==', today)
      .where('sign', '==', signName)
      .where('status', '==', 'published')
      .limit(1)
      .get()

    if (predSnap.empty) continue

    const prediction = predSnap.docs[0].data()
    const tokens = tokensByUid.get(userData.uid)
    if (!tokens || tokens.length === 0) continue

    const signEmoji = prediction.emoji || '✨'

    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: `${signEmoji} Bom dia, ${displayName}!`,
        body: `Sua previsão para ${signName} já está disponível. Clique para descobrir como será seu dia.`,
      },
      webpush: {
        fcmOptions: { link: '/horoscopo' },
        notification: {
          icon: '/l20-icon.svg',
          badge: '/favicon.svg',
          tag: `horoscope-${signName}`,
          renotify: true,
        },
      },
      data: {
        url: '/horoscopo',
        type: 'horoscope',
        sign: signName,
      },
    }

    const response = await messaging.sendEachForMulticast(message)
    sentCount += response.successCount

    const invalidTokens: string[] = []
    response.responses.forEach((resp, index) => {
      if (!resp.success && (resp.error?.code === 'messaging/registration-token-not-registered' || resp.error?.code === 'messaging/invalid-registration-token')) {
        invalidTokens.push(tokens[index])
      }
    })

    if (invalidTokens.length > 0) {
      const batch = db.batch()
      for (const token of invalidTokens) {
        const tokenSnap = await db.collection('notificationTokens').where('token', '==', token).get()
        tokenSnap.docs.forEach((doc) => batch.update(doc.ref, { active: false, updatedAt: admin.firestore.FieldValue.serverTimestamp() }))
      }
      await batch.commit()
    }
  }
})

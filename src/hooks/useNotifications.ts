import { useCallback, useEffect, useState } from 'react'
import { collection, addDoc, getDocs, query, where, writeBatch } from 'firebase/firestore'
import { getToken, onMessage } from 'firebase/messaging'
import { db, getMessagingInstance } from '../lib/firebase'
import { useAuth } from '../context/useAuth'

type NotificationPermission = 'default' | 'granted' | 'denied' | 'unsupported'

export function useNotifications() {
  const { user } = useAuth()
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [lastMessage, setLastMessage] = useState<{ title: string; body: string; url?: string } | null>(null)

  useEffect(() => {
    if (!('Notification' in window)) {
      setPermission('unsupported')
      return
    }
    setPermission(Notification.permission as NotificationPermission)
  }, [])

  useEffect(() => {
    if (permission !== 'granted' || !user) {
      setIsSubscribed(false)
      return
    }

    let cancelled = false
    let unsubscribeMessage: (() => void) | undefined

    getMessagingInstance().then((messaging) => {
      if (cancelled || !messaging) return

      unsubscribeMessage = onMessage(messaging, (payload) => {
        const data = payload.data || {}
        const title = payload.notification?.title || data.title || 'Rádio L20'
        const body = payload.notification?.body || data.body || ''
        const url = data.url

        setLastMessage({ title, body, url })

        if (Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/l20-icon.svg',
            badge: '/favicon.svg',
            tag: 'radio-l20',
            data: { url },
          })
        }
      })
    })

    return () => {
      cancelled = true
      unsubscribeMessage?.()
    }
  }, [permission, user])

  const saveToken = useCallback(async (token: string) => {
    if (!user) return

    try {
      const tokensRef = collection(db, 'notificationTokens')
      const existing = await getDocs(query(tokensRef, where('uid', '==', user.uid)))

      if (!existing.empty) {
        const batch = writeBatch(db)
        existing.docs.forEach((d) => {
          batch.update(d.ref, { token, active: true, updatedAt: new Date() })
        })
        await batch.commit()
      } else {
        await addDoc(tokensRef, {
          token,
          uid: user.uid,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    } catch (err) {
      console.error('Erro ao salvar token de notificação:', err)
    }
  }, [user])

  const subscribe = useCallback(async () => {
    try {
      const messaging = await getMessagingInstance()
      if (!messaging) return

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined,
      })

      if (token) {
        setIsSubscribed(true)
        setPermission('granted')
        await saveToken(token)
      }
    } catch (err) {
      console.error('Erro ao inscrever notificações:', err)
    }
  }, [saveToken])

  const unsubscribe = useCallback(async () => {
    if (!user) return

    try {
      const tokensRef = collection(db, 'notificationTokens')
      const existing = await getDocs(query(tokensRef, where('uid', '==', user.uid)))

      const batch = writeBatch(db)
      existing.docs.forEach((d) => {
        batch.update(d.ref, { active: false, updatedAt: new Date() })
      })
      await batch.commit()

      setIsSubscribed(false)
    } catch (err) {
      console.error('Erro ao cancelar inscrição de notificações:', err)
    }
  }, [user])

  const dismissMessage = useCallback(() => {
    setLastMessage(null)
  }, [])

  return {
    permission,
    isSubscribed,
    lastMessage,
    subscribe,
    unsubscribe,
    dismissMessage,
    isSupported: permission !== 'unsupported',
  }
}

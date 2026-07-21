import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { isUserBlocked, deleteAnyMessage } from './chatAdminService'
import { getAdminAccess } from './adminAccessService'
import type { User } from 'firebase/auth'

export type ChatMessage = {
  id: string
  text: string
  uid: string
  displayName: string
  photoURL: string | null
  isAdmin?: boolean
  role?: string
  pinned?: boolean
  replyTo?: string
  replyToName?: string
  createdAt?: unknown
}

const MESSAGES_COLLECTION = 'chatMessages'
const MAX_MESSAGES = 100
const RATE_LIMIT_MS = 3000

let lastSentAt = 0

export function subscribeMessages(
  onMessages: (messages: ChatMessage[]) => void,
  onError?: (error: unknown) => void,
) {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(MAX_MESSAGES),
  )

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ChatMessage[]

    onMessages(messages.reverse())
  }, (error) => {
    if (onError) {
      onError(error)
    } else {
      console.error('Erro ao ouvir mensagens do chat:', error)
    }
  })
}

export async function sendMessage(
  user: User,
  text: string,
  chatDisplayName?: string,
  replyTo?: string,
  replyToName?: string,
): Promise<'ok' | 'blocked' | 'rate-limited' | 'empty'> {
  const now = Date.now()
  if (now - lastSentAt < RATE_LIMIT_MS) {
    return 'rate-limited'
  }

  const trimmed = text.trim()
  if (!trimmed || trimmed.length > 500) {
    return 'empty'
  }

  const blocked = await isUserBlocked(user.uid)
  if (blocked) {
    return 'blocked'
  }

  let isAdmin = false
  let role: string | null = null
  try {
    const adminResult = await getAdminAccess(user.uid)
    isAdmin = adminResult.isAdmin
    role = adminResult.data?.role ?? null
  } catch {
    // Not an admin or error checking — default to non-admin
  }

  lastSentAt = now

  await addDoc(collection(db, MESSAGES_COLLECTION), {
    text: trimmed,
    uid: user.uid,
    displayName: chatDisplayName || user.displayName || 'Usuário',
    photoURL: user.photoURL || null,
    isAdmin,
    role,
    replyTo: replyTo || null,
    replyToName: replyToName || null,
    createdAt: serverTimestamp(),
  })

  return 'ok'
}

export const deleteMessage = deleteAnyMessage

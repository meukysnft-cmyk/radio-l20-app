import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

const MESSAGES_COLLECTION = 'chatMessages'
const BLOCKED_USERS_COLLECTION = 'chatBlockedUsers'

export type BlockedUser = {
  uid: string
  displayName?: string
  blockedAt?: unknown
  blockedBy?: string
}

export async function pinMessage(messageId: string, pinned: boolean) {
  await updateDoc(doc(db, MESSAGES_COLLECTION, messageId), { pinned })
}

export async function deleteAnyMessage(messageId: string) {
  await deleteDoc(doc(db, MESSAGES_COLLECTION, messageId))
}

export async function blockUser(uid: string, displayName: string, blockedBy: string) {
  await setDoc(doc(db, BLOCKED_USERS_COLLECTION, uid), {
    uid,
    displayName,
    blockedAt: new Date().toISOString(),
    blockedBy,
  })
}

export async function unblockUser(uid: string) {
  await deleteDoc(doc(db, BLOCKED_USERS_COLLECTION, uid))
}

export function subscribeBlockedUsers(
  onBlocked: (users: BlockedUser[]) => void,
  onError?: (error: unknown) => void,
) {
  return onSnapshot(collection(db, BLOCKED_USERS_COLLECTION), (snapshot) => {
    const users = snapshot.docs.map((d) => d.data() as BlockedUser)
    onBlocked(users)
  }, onError)
}

export async function isUserBlocked(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, BLOCKED_USERS_COLLECTION, uid))
  return snap.exists()
}

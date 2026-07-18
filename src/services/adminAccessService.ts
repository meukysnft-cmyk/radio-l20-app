import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export type AdminUserDocument = {
  email?: string
  role?: string
  active?: boolean
  name?: string
}

export type AdminAccessResult = {
  exists: boolean
  data: AdminUserDocument | null
  isAdmin: boolean
}

export async function getAdminAccess(uid: string) {
  try {
    const snapshot = await getDoc(doc(db, 'adminUsers', uid))

    if (!snapshot.exists()) {
      return {
        exists: false,
        data: null,
        isAdmin: false,
      } satisfies AdminAccessResult
    }

    const data = snapshot.data() as AdminUserDocument
    const isAdmin = data.active === true || data.role === 'admin'

    return {
      exists: true,
      data,
      isAdmin,
    } satisfies AdminAccessResult
  } catch (error) {
    console.error('Não foi possível verificar permissão de administrador.', error)
    throw new Error('Não foi possível verificar a permissão de administrador.', {
      cause: error,
    })
  }
}

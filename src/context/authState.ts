import { createContext } from 'react'
import type { User } from 'firebase/auth'

export type AuthContextValue = {
  user: User | null
  loading: boolean
  isLoading: boolean
  isAdmin: boolean
  adminLoading: boolean
  authError: string
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshAdminAccess: (uid?: string) => Promise<boolean>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

import { getRedirectResult, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut as firebaseSignOut } from 'firebase/auth'
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { auth, googleAuthProvider } from '../lib/firebase'
import { getAdminAccess } from '../services/adminAccessService'
import { AuthContext } from './authState'
import type { User } from 'firebase/auth'

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const refreshAdminAccess = useCallback(async (uid?: string) => {
    const userId = uid || auth.currentUser?.uid

    if (!userId) {
      setIsAdmin(false)
      return false
    }

    setAdminLoading(true)
    setAuthError('')

    try {
      const result = await getAdminAccess(userId)
      const finalIsAdmin = result.isAdmin

      if (import.meta.env.DEV) {
        console.debug('[Rádio L20 Admin]', {
          uid: userId,
          email: auth.currentUser?.email,
          adminDocExists: result.exists,
          adminData: result.data,
          isAdmin: finalIsAdmin,
        })
      }

      setIsAdmin(finalIsAdmin)
      return finalIsAdmin
    } catch (error) {
      console.error('Falha ao validar administrador.', error)
      setIsAdmin(false)
      setAuthError('Não foi possível verificar a permissão de administrador.')
      if (import.meta.env.DEV) {
        console.debug('[Rádio L20 Admin]', {
          uid: userId,
          email: auth.currentUser?.email,
          adminDocExists: false,
          adminData: null,
          isAdmin: false,
          error,
        })
      }
      return false
    } finally {
      setAdminLoading(false)
    }
  }, [])

  useEffect(() => {
    let unsubAuth: (() => void) | undefined

    getRedirectResult(auth)
      .catch((err) => {
        if (import.meta.env.DEV) {
          console.debug('[Rádio L20 Auth] redirect result error', err)
        }
      })
      .finally(() => {
        unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser)

          if (currentUser) {
            if (import.meta.env.DEV) {
              console.debug('[Rádio L20 Auth]', {
                uid: currentUser.uid,
                email: currentUser.email,
              })
            }
            await refreshAdminAccess(currentUser.uid)
          } else {
            setIsAdmin(false)
            setAuthError('')
          }

          setLoading(false)
        })
      })

    return () => {
      unsubAuth?.()
    }
  }, [refreshAdminAccess])

  const loginWithGoogle = useCallback(async () => {
    setAuthError('')
    if (isMobileDevice()) {
      await signInWithRedirect(auth, googleAuthProvider)
    } else {
      await signInWithPopup(auth, googleAuthProvider)
    }
  }, [])

  const logout = useCallback(async () => {
    await firebaseSignOut(auth)
    setIsAdmin(false)
    setAuthError('')
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoading: loading,
      isAdmin,
      adminLoading,
      authError,
      loginWithGoogle,
      logout,
      refreshAdminAccess,
    }),
    [adminLoading, authError, isAdmin, loading, loginWithGoogle, logout, refreshAdminAccess, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

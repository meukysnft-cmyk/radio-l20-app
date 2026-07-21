import { getRedirectResult, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut as firebaseSignOut } from 'firebase/auth'
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const [adminRole, setAdminRole] = useState<string | null>(null)
  const [adminLoading, setAdminLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const adminCheckIdRef = useRef(0)

  const refreshAdminAccess = useCallback(async (uid?: string) => {
    const userId = uid || auth.currentUser?.uid

    if (!userId) {
      setIsAdmin(false)
      return false
    }

    const checkId = ++adminCheckIdRef.current
    setAdminLoading(true)
    setAuthError('')

    try {
      const result = await getAdminAccess(userId)

      if (checkId !== adminCheckIdRef.current) return false

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
      setAdminRole(result.data?.role ?? null)
      return finalIsAdmin
    } catch (error) {
      if (checkId !== adminCheckIdRef.current) return false

      console.error('Falha ao validar administrador.', error)
      setIsAdmin(false)
      setAdminRole(null)
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
      if (checkId === adminCheckIdRef.current) {
        setAdminLoading(false)
      }
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
            setAdminRole(null)
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
    setAdminRole(null)
    setAuthError('')
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoading: loading,
      isAdmin,
      adminRole,
      adminLoading,
      authError,
      loginWithGoogle,
      logout,
      refreshAdminAccess,
    }),
    [adminLoading, adminRole, authError, isAdmin, loading, loginWithGoogle, logout, refreshAdminAccess, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

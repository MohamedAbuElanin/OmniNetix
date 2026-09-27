import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { canAccessDashboard, fetchAdminProfile, signOutAdmin, type AdminProfile } from '../services/adminAuth.service'

type AdminAuthState = {
  session: Session | null
  user: User | null
  profile: AdminProfile | null
  loading: boolean
  profileError: string | null
  authenticated: boolean
  authorized: boolean
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthState | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function hydrate(nextSession: Session | null) {
      if (!active) return
      setLoading(true)
      setSession(nextSession)
      if (!nextSession) {
        setProfile(null)
        setProfileError(null)
        if (active) setLoading(false)
        return
      }
      const result = await fetchAdminProfile(nextSession.user.id)
      if (!active) return
      setProfile(result.profile)
      setProfileError(result.error)
      setLoading(false)
    }
    void supabase.auth.getSession().then(({ data }) => void hydrate(data.session)).catch(() => {
      if (!active) return
      setSession(null)
      setProfile(null)
      setProfileError('Unable to restore your session.')
      setLoading(false)
    })
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void hydrate(nextSession)
    })
    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AdminAuthState>(() => ({
    session,
    user: session?.user ?? null,
    profile,
    loading,
    profileError,
    authenticated: Boolean(session),
    authorized: canAccessDashboard(profile),
    signOut: signOutAdmin
  }), [session, profile, loading, profileError])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminSession() {
  const context = useContext(AdminAuthContext)
  if (!context) throw new Error('useAdminSession must be used within AdminAuthProvider')
  return context
}

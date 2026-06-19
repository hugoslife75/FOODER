import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { getOrCreateUserProfile } from '@/services/authService'
import type { User } from '@/types'

interface AuthState {
  session: Session | null
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth(): AuthState {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 1. Hydrate from existing session on mount
    supabase.auth.getSession().then(async ({ data }) => {
      const s = data.session
      setSession(s)
      if (s) {
        const profile = await getOrCreateUserProfile(s.user.id, s.user.email ?? '')
        setUser(profile)
      }
      setIsLoading(false)
    })

    // 2. Subscribe to auth changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession)

        if (newSession) {
          const profile = await getOrCreateUserProfile(
            newSession.user.id,
            newSession.user.email ?? ''
          )
          setUser(profile)
        } else {
          setUser(null)
          // Clear all cached queries on sign-out
          queryClient.clear()
        }

        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [queryClient])

  return {
    session,
    user,
    isLoading,
    isAuthenticated: !!session && !!user,
  }
}

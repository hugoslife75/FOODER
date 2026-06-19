import { supabase } from '@/lib/supabaseClient'
import type { User } from '@/types'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signInWithMagicLink(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// ─── User profile ─────────────────────────────────────────────────────────────

/**
 * Fetches the user row from our `users` table.
 * Called after auth; if the row doesn't exist yet, it creates it.
 */
export async function getOrCreateUserProfile(
  authUserId: string,
  email: string
): Promise<User> {
  // Try to get existing profile
  const { data: existing, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUserId)
    .single()

  if (existing) return existing

  // Row not found — create it (first sign-in)
  if (fetchError?.code !== 'PGRST116') throw fetchError

  const { data: created, error: insertError } = await supabase
    .from('users')
    .insert({ id: authUserId, email })
    .select('*')
    .single()

  if (insertError) throw insertError
  return created
}

export async function updateUserProfile(
  userId: string,
  updates: { username?: string; avatar_url?: string }
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single()

  if (error) throw error
  return data
}

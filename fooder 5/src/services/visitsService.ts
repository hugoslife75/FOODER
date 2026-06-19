import { supabase } from '@/lib/supabaseClient'
import type { Visit, CreateVisitPayload } from '@/types'

// ─── Create a visit ───────────────────────────────────────────────────────────

/**
 * Inserts a visit row.
 *
 * The `rating_avg` on `places` is updated automatically by a Postgres trigger
 * (see migrations/002_rating_trigger.sql) — no manual update needed here.
 *
 * Constraint: a user can only visit a place if they have a `like` swipe for it.
 * This is enforced at the UI level, but the DB also has a CHECK constraint.
 */
export async function createVisit(
  userId: string,
  payload: CreateVisitPayload
): Promise<Visit> {
  const { data, error } = await supabase
    .from('visits')
    .insert({
      user_id: userId,
      place_id: payload.place_id,
      rating: payload.rating,
      review: payload.review ?? null,
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}

// ─── Read visits ──────────────────────────────────────────────────────────────

/** All visits for a given user */
export async function getVisitsByUser(userId: string): Promise<Visit[]> {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

/** Set of visited place IDs — used to show "Visité" badge */
export async function getVisitedPlaceIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('visits')
    .select('place_id')
    .eq('user_id', userId)

  if (error) throw error
  return new Set((data ?? []).map((row) => row.place_id))
}

/** Single visit record for a specific place */
export async function getVisitByPlace(
  userId: string,
  placeId: string
): Promise<Visit | null> {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('user_id', userId)
    .eq('place_id', placeId)
    .maybeSingle()

  if (error) throw error
  return data
}

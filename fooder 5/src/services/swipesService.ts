import { supabase } from '@/lib/supabaseClient'
import type { Swipe, SwipeDirection, CreateSwipePayload } from '@/types'

// ─── Create a swipe ───────────────────────────────────────────────────────────

/**
 * Inserts a swipe row. The `(user_id, place_id)` unique constraint in the DB
 * guarantees a user can only swipe a restaurant once — the insert will throw
 * a 23505 conflict error if attempted twice, which we handle gracefully.
 */
export async function createSwipe(
  userId: string,
  payload: CreateSwipePayload
): Promise<Swipe> {
  const { data, error } = await supabase
    .from('swipes')
    .insert({
      user_id: userId,
      place_id: payload.place_id,
      direction: payload.direction,
    })
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Already swiped this restaurant.')
    }
    throw error
  }

  return data
}

// ─── Read swipes ──────────────────────────────────────────────────────────────

/** All swipes for a given user */
export async function getSwipesByUser(userId: string): Promise<Swipe[]> {
  const { data, error } = await supabase
    .from('swipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

/** Only the liked swipes (used to populate Favoris) */
export async function getLikedPlaceIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('swipes')
    .select('place_id')
    .eq('user_id', userId)
    .eq('direction', 'like' satisfies SwipeDirection)

  if (error) throw error
  return (data ?? []).map((row) => row.place_id)
}

/** Set of all swiped place IDs (like + pass) — used to exclude from feed */
export async function getSwipedPlaceIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('swipes')
    .select('place_id')
    .eq('user_id', userId)

  if (error) throw error
  return new Set((data ?? []).map((row) => row.place_id))
}

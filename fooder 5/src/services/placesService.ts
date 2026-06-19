import { supabase } from '@/lib/supabaseClient'
import { haversineDistance } from '@/lib/geo'
import type { Place, PlaceWithDistance, Coordinates } from '@/types'

const DEFAULT_RADIUS_KM = 2

// ─── Fetch places within radius ───────────────────────────────────────────────

/**
 * Primary strategy: calls the `places_within_radius` Postgres RPC function,
 * which uses PostGIS for accurate server-side geo filtering.
 *
 * Fallback: fetches all places and filters client-side using Haversine.
 * This ensures the app works even without PostGIS installed.
 */
export async function getPlacesNearby(
  coords: Coordinates,
  radiusKm: number = DEFAULT_RADIUS_KM
): Promise<PlaceWithDistance[]> {
  try {
    return await getPlacesViaRpc(coords, radiusKm)
  } catch {
    console.warn('[placesService] RPC unavailable, falling back to client-side filtering')
    return getPlacesClientFilter(coords, radiusKm)
  }
}

async function getPlacesViaRpc(
  coords: Coordinates,
  radiusKm: number
): Promise<PlaceWithDistance[]> {
  const { data, error } = await supabase.rpc('places_within_radius', {
    user_lat: coords.latitude,
    user_lng: coords.longitude,
    radius_km: radiusKm,
  })

  if (error) throw error

  return (data ?? []).map((row) => ({
    ...row,
    distance: Math.round(row.distance * 10) / 10,
  }))
}

async function getPlacesClientFilter(
  coords: Coordinates,
  radiusKm: number
): Promise<PlaceWithDistance[]> {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? [])
    .map((place: Place) => ({
      ...place,
      distance: haversineDistance(coords, {
        latitude: place.latitude,
        longitude: place.longitude,
      }),
    }))
    .filter((p) => p.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
}

// ─── Single place ─────────────────────────────────────────────────────────────

export async function getPlaceById(id: string): Promise<Place> {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// ─── Filter out already-swiped places ────────────────────────────────────────

/**
 * Returns `places` with already-swiped IDs removed.
 * Called in the feed to never show a restaurant twice.
 */
export function filterUnswipedPlaces(
  places: PlaceWithDistance[],
  swipedPlaceIds: Set<string>
): PlaceWithDistance[] {
  return places.filter((p) => !swipedPlaceIds.has(p.id))
}

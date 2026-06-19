import type { Coordinates } from '@/types'

const EARTH_RADIUS_KM = 6371

/**
 * Haversine formula — returns distance in km between two coordinates.
 * Used client-side when the Supabase RPC is unavailable.
 */
export function haversineDistance(from: Coordinates, to: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(to.latitude - from.latitude)
  const dLon = toRad(to.longitude - from.longitude)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(EARTH_RADIUS_KM * c * 10) / 10
}

/**
 * Returns true if `distance` is within `radiusKm`.
 */
export function isWithinRadius(distance: number, radiusKm: number): boolean {
  return distance <= radiusKm
}

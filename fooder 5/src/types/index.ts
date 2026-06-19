// ─── DATABASE MODELS (maps exactly to Supabase tables) ───────────────────────

export interface User {
  id: string
  created_at: string
  email: string
  username: string | null
  avatar_url: string | null
}

export interface Place {
  id: string
  created_at: string
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  image_url: string
  cuisine_type: string
  price_range: string
  rating_avg: number
}

export type SwipeDirection = 'like' | 'pass'

export interface Swipe {
  id: string
  created_at: string
  user_id: string
  place_id: string
  direction: SwipeDirection
}

export interface Visit {
  id: string
  created_at: string
  user_id: string
  place_id: string
  rating: number
  review: string | null
}

// ─── EXTENDED / DERIVED TYPES ─────────────────────────────────────────────────

/** Place enriched with computed distance (km) from user's location */
export interface PlaceWithDistance extends Place {
  distance: number
}

/** Full profile aggregation for the Profile screen */
export interface UserProfile extends User {
  likes_count: number
  visits_count: number
}

// ─── FORM PAYLOADS ───────────────────────────────────────────────────────────

export interface CreateSwipePayload {
  place_id: string
  direction: SwipeDirection
}

export interface CreateVisitPayload {
  place_id: string
  rating: number
  review?: string
}

// ─── GEO ─────────────────────────────────────────────────────────────────────

export interface Coordinates {
  latitude: number
  longitude: number
}

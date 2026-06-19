import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,       // 2 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

// ─── Query key factory ────────────────────────────────────────────────────────
// Centralised keys prevent cache mismatches across hooks.

export const queryKeys = {
  places: {
    all: ['places'] as const,
    nearby: (lat: number, lng: number, radius: number) =>
      ['places', 'nearby', lat, lng, radius] as const,
    detail: (id: string) => ['places', id] as const,
  },
  swipes: {
    all: ['swipes'] as const,
    byUser: (userId: string) => ['swipes', 'user', userId] as const,
  },
  visits: {
    all: ['visits'] as const,
    byUser: (userId: string) => ['visits', 'user', userId] as const,
  },
  user: {
    profile: (userId: string) => ['user', 'profile', userId] as const,
  },
} as const

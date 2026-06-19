import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'
import { getPlacesNearby, filterUnswipedPlaces } from '@/services/placesService'
import type { Coordinates, PlaceWithDistance } from '@/types'

const RADIUS_KM = 2

interface UsePlacesOptions {
  coords: Coordinates | null
  swipedPlaceIds: Set<string>
  enabled?: boolean
}

interface UsePlacesResult {
  places: PlaceWithDistance[]
  allNearby: PlaceWithDistance[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function usePlaces({
  coords,
  swipedPlaceIds,
  enabled = true,
}: UsePlacesOptions): UsePlacesResult {
  const query = useQuery({
    queryKey: queryKeys.places.nearby(
      coords?.latitude ?? 0,
      coords?.longitude ?? 0,
      RADIUS_KM
    ),
    queryFn: () => {
      if (!coords) throw new Error('No coordinates available')
      return getPlacesNearby(coords, RADIUS_KM)
    },
    enabled: enabled && !!coords,
    staleTime: 1000 * 60 * 5, // Fresh for 5 minutes
  })

  const allNearby = query.data ?? []
  const places = filterUnswipedPlaces(allNearby, swipedPlaceIds)

  return {
    places,
    allNearby,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  }
}

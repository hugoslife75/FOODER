import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'
import {
  createSwipe,
  getSwipedPlaceIds,
  getLikedPlaceIds,
} from '@/services/swipesService'
import type { SwipeDirection } from '@/types'

interface UseSwipeOptions {
  userId: string | null
}

interface UseSwipeResult {
  swipedIds: Set<string>
  likedIds: Set<string>
  isLoading: boolean
  swipe: (placeId: string, direction: SwipeDirection) => Promise<void>
  isSwipePending: boolean
}

export function useSwipe({ userId }: UseSwipeOptions): UseSwipeResult {
  const queryClient = useQueryClient()

  // ── Fetchers ──────────────────────────────────────────────────────────────
  const swipedQuery = useQuery({
    queryKey: queryKeys.swipes.byUser(userId ?? ''),
    queryFn: () => getSwipedPlaceIds(userId!),
    enabled: !!userId,
    staleTime: Infinity, // Swiped IDs never go stale during a session
  })

  const likedQuery = useQuery({
    queryKey: [...queryKeys.swipes.byUser(userId ?? ''), 'liked'],
    queryFn: () => getLikedPlaceIds(userId!),
    enabled: !!userId,
    staleTime: Infinity,
  })

  // ── Mutation ──────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: ({ placeId, direction }: { placeId: string; direction: SwipeDirection }) =>
      createSwipe(userId!, { place_id: placeId, direction }),

    onMutate: async ({ placeId, direction }) => {
      // Optimistic update: immediately add to local sets
      const swipedKey = queryKeys.swipes.byUser(userId!)
      const likedKey = [...swipedKey, 'liked']

      await queryClient.cancelQueries({ queryKey: swipedKey })

      const prevSwiped = queryClient.getQueryData<Set<string>>(swipedKey)
      const prevLiked = queryClient.getQueryData<string[]>(likedKey)

      queryClient.setQueryData<Set<string>>(swipedKey, (old) =>
        new Set([...(old ?? []), placeId])
      )

      if (direction === 'like') {
        queryClient.setQueryData<string[]>(likedKey, (old) =>
          [...(old ?? []), placeId]
        )
      }

      return { prevSwiped, prevLiked }
    },

    onError: (_err, { direction }, context) => {
      // Rollback on error
      if (context?.prevSwiped !== undefined) {
        queryClient.setQueryData(queryKeys.swipes.byUser(userId!), context.prevSwiped)
      }
      if (context?.prevLiked !== undefined && direction === 'like') {
        queryClient.setQueryData(
          [...queryKeys.swipes.byUser(userId!), 'liked'],
          context.prevLiked
        )
      }
    },
  })

  const swipe = async (placeId: string, direction: SwipeDirection) => {
    await mutation.mutateAsync({ placeId, direction })
  }

  return {
    swipedIds: swipedQuery.data ?? new Set<string>(),
    likedIds: new Set(likedQuery.data ?? []),
    isLoading: swipedQuery.isLoading || likedQuery.isLoading,
    swipe,
    isSwipePending: mutation.isPending,
  }
}

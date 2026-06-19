import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'
import {
  createVisit,
  getVisitedPlaceIds,
  getVisitsByUser,
} from '@/services/visitsService'
import type { CreateVisitPayload, Visit } from '@/types'

interface UseVisitsOptions {
  userId: string | null
}

interface UseVisitsResult {
  visitedIds: Set<string>
  visits: Visit[]
  isLoading: boolean
  markVisited: (payload: CreateVisitPayload) => Promise<Visit>
  isVisitPending: boolean
}

export function useVisits({ userId }: UseVisitsOptions): UseVisitsResult {
  const queryClient = useQueryClient()

  // ── Fetchers ──────────────────────────────────────────────────────────────
  const visitedIdsQuery = useQuery({
    queryKey: queryKeys.visits.byUser(userId ?? ''),
    queryFn: () => getVisitedPlaceIds(userId!),
    enabled: !!userId,
    staleTime: Infinity,
  })

  const visitsQuery = useQuery({
    queryKey: [...queryKeys.visits.byUser(userId ?? ''), 'full'],
    queryFn: () => getVisitsByUser(userId!),
    enabled: !!userId,
  })

  // ── Mutation ──────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (payload: CreateVisitPayload) =>
      createVisit(userId!, payload),

    onSuccess: (newVisit) => {
      // Update visited IDs set
      queryClient.setQueryData<Set<string>>(
        queryKeys.visits.byUser(userId!),
        (old) => new Set([...(old ?? []), newVisit.place_id])
      )
      // Append to full visits list
      queryClient.setQueryData<Visit[]>(
        [...queryKeys.visits.byUser(userId!), 'full'],
        (old) => [newVisit, ...(old ?? [])]
      )
      // Invalidate the place to refresh its rating_avg (updated by trigger)
      queryClient.invalidateQueries({
        queryKey: queryKeys.places.detail(newVisit.place_id),
      })
    },
  })

  const markVisited = async (payload: CreateVisitPayload): Promise<Visit> => {
    return mutation.mutateAsync(payload)
  }

  return {
    visitedIds: visitedIdsQuery.data ?? new Set<string>(),
    visits: visitsQuery.data ?? [],
    isLoading: visitedIdsQuery.isLoading,
    markVisited,
    isVisitPending: mutation.isPending,
  }
}

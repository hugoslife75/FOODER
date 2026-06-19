import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthContext } from '@/context/AuthContext'
import { useSwipe } from '@/hooks/useSwipe'
import { useVisits } from '@/hooks/useVisits'
import { usePlaces } from '@/hooks/usePlaces'
import { useLocation } from '@/hooks/useLocation'
import RestaurantCard from '@/components/shared/RestaurantCard'
import { RestaurantCardSkeleton } from '@/components/ui/SkeletonLoader'
import EmptyState from '@/components/ui/EmptyState'

// ─── FavorisPage ──────────────────────────────────────────────────────────────
export function FavorisPage() {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { likedIds, isLoading: swipeLoading } = useSwipe({ userId: user?.id ?? null })
  const { visitedIds } = useVisits({ userId: user?.id ?? null })
  const location = useLocation()

  const { allNearby, isLoading: placesLoading } = usePlaces({
    coords: location.coords,
    swipedPlaceIds: new Set(), // We want ALL places here, not filtered
    enabled: !!location.coords,
  })

  const isLoading = swipeLoading || placesLoading
  const likedPlaces = allNearby.filter((p) => likedIds.has(p.id))

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em' }}>Favoris</h1>
          {likedPlaces.length > 0 && (
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              {likedPlaces.length} restaurant{likedPlaces.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[0, 1, 2].map((i) => <RestaurantCardSkeleton key={i} />)}
          </div>
        ) : likedPlaces.length === 0 ? (
          <EmptyState
            emoji="❤️"
            title="Aucun favori"
            subtitle={"Swipe à droite pour sauvegarder\ntes restaurants préférés ici."}
            action={{ label: 'Découvrir des restaurants', onClick: () => navigate('/feed') }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
            {likedPlaces.map((place, i) => (
              <RestaurantCard
                key={place.id}
                place={place}
                isVisited={visitedIds.has(place.id)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
      <div style={{ height: 88, flexShrink: 0 }} />
    </div>
  )
}

// ─── ProfilPage ───────────────────────────────────────────────────────────────
export function ProfilPage() {
  const { user } = useAuthContext()
  const { likedIds } = useSwipe({ userId: user?.id ?? null })
  const { visits } = useVisits({ userId: user?.id ?? null })

  const stats = [
    { label: 'Likés', value: likedIds.size, color: 'var(--accent)' },
    { label: 'Visités', value: visits.length, color: 'var(--green)' },
    { label: 'Autour', value: 6, color: '#818CF8' },
  ]

  const preferences = [
    { label: 'Notifications', value: 'Activées' },
    { label: 'Rayon', value: '2 km' },
    { label: 'Langue', value: 'Français' },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px 12px', flexShrink: 0 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em' }}>Profil</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0 24px', gap: 12 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              width: 88, height: 88, borderRadius: 26,
              background: 'linear-gradient(135deg, rgba(255,77,109,0.3), rgba(255,77,109,0.1))',
              border: '0.5px solid rgba(255,77,109,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36,
            }}
          >
            🍜
          </motion.div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em' }}>
              {user?.username ?? user?.email?.split('@')[0] ?? 'Foodie'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{user?.email}</p>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 100,
            background: 'var(--accent-soft)', border: '0.5px solid rgba(255,77,109,0.3)',
          }}>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>📍 Paris · 2 km</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{
              flex: 1, padding: '16px 12px',
              background: 'var(--surface-elevated)',
              borderRadius: 'var(--radius)',
              border: '0.5px solid var(--border)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.04em', color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Preferences */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{
            fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10,
          }}>
            Préférences
          </h3>
          <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '0.5px solid var(--border)' }}>
            {preferences.map((item, i) => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 16px',
                background: 'var(--surface-elevated)',
                borderTop: i > 0 ? '0.5px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: 14 }}>{item.label}</span>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <button style={{
          width: '100%', padding: '15px 0',
          borderRadius: 'var(--radius)',
          background: 'transparent',
          border: '0.5px solid var(--border)',
          color: 'var(--accent)', fontSize: 14, fontWeight: 600,
          marginBottom: 24,
        }}>
          Se déconnecter
        </button>
      </div>
      <div style={{ height: 88, flexShrink: 0 }} />
    </div>
  )
}

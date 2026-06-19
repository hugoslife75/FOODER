import { motion } from 'framer-motion'
import { useAuthContext } from '@/context/AuthContext'
import { usePlaces } from '@/hooks/usePlaces'
import { useSwipe } from '@/hooks/useSwipe'
import { useLocation } from '@/hooks/useLocation'
import SwipeCard from '@/components/shared/SwipeCard'
import { SwipeCardSkeleton } from '@/components/ui/SkeletonLoader'
import EmptyState from '@/components/ui/EmptyState'
import { HeartIcon, XIcon, StarIcon, MapPinIcon } from '@/components/ui/Icons'
import type { SwipeDirection } from '@/types'

// ─── Action button ────────────────────────────────────────────────────────────
function ActionButton({
  icon: Icon,
  color,
  bg,
  size = 56,
  onClick,
  label,
}: {
  icon: React.FC<{ size?: number; color?: string; filled?: boolean }>
  color: string
  bg: string
  size?: number
  onClick?: () => void
  label: string
}) {
  return (
    <motion.button
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: bg,
        border: '0.5px solid var(--border-strong)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 20px ${bg}44`,
      }}
    >
      <Icon size={size * 0.42} color={color} />
    </motion.button>
  )
}

// ─── Location request ────────────────────────────────────────────────────────
function LocationRequest({
  onRequest,
  onManual,
  status,
  error,
}: {
  onRequest: () => void
  onManual: (city: string) => void
  status: string
  error: string | null
}) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 32px', gap: 24, textAlign: 'center',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 22,
        background: 'var(--accent-soft)',
        border: '0.5px solid rgba(255,77,109,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <MapPinIcon size={32} color="var(--accent)" />
      </div>
      <div>
        <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Active ta localisation
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          Pour voir les restaurants autour de toi, Fooder a besoin de ta position.
        </p>
      </div>
      <button
        onClick={onRequest}
        disabled={status === 'requesting'}
        style={{
          width: '100%', padding: '16px 0',
          borderRadius: 'var(--radius)',
          background: 'var(--accent)', color: '#fff',
          fontSize: 15, fontWeight: 600,
          opacity: status === 'requesting' ? 0.6 : 1,
          boxShadow: '0 8px 32px var(--accent-glow)',
        }}
      >
        {status === 'requesting' ? 'Localisation…' : 'Autoriser la localisation'}
      </button>
      <button
        onClick={() => {
          const city = prompt('Quelle ville ?')
          if (city) onManual(city)
        }}
        style={{
          fontSize: 13, color: 'var(--text-secondary)',
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}
      >
        Entrer ma ville manuellement
      </button>
      {error && (
        <p style={{ fontSize: 12, color: 'var(--accent)' }}>{error}</p>
      )}
    </div>
  )
}

// ─── FeedPage ─────────────────────────────────────────────────────────────────
export default function FeedPage() {
  const { user } = useAuthContext()
  const location = useLocation()
  const { swipedIds, likedIds, swipe, isSwipePending } = useSwipe({ userId: user?.id ?? null })
  const { places, isLoading } = usePlaces({
    coords: location.coords,
    swipedPlaceIds: swipedIds,
    enabled: !!location.coords,
  })

  const topPlace = places[0]

  const handleSwipe = async (placeId: string, direction: SwipeDirection) => {
    await swipe(placeId, direction)
  }

  const handleButtonSwipe = (direction: SwipeDirection) => {
    if (topPlace && !isSwipePending) {
      handleSwipe(topPlace.id, direction)
    }
  }

  // Location not granted yet
  if (!location.coords) {
    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <Header />
        <LocationRequest
          onRequest={location.requestLocation}
          onManual={location.setManualCity}
          status={location.status}
          error={location.error}
        />
      </div>
    )
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header likedCount={likedIds.size} />

      {/* Card stack */}
      <div style={{ position: 'relative', flex: 1, margin: '0 16px' }}>
        {isLoading ? (
          <SwipeCardSkeleton />
        ) : places.length === 0 ? (
          <EmptyState
            emoji="🍽️"
            title="Plus de restaurants"
            subtitle={"Tu as tout vu dans ce secteur.\nReviens demain pour de nouvelles tables."}
          />
        ) : (
          places.slice(0, 3).map((place, i) => (
            <SwipeCard
              key={place.id}
              place={place}
              isTop={i === 0}
              stackIndex={i}
              onSwipe={handleSwipe}
            />
          )).reverse()
        )}
      </div>

      {/* Action buttons */}
      {!isLoading && places.length > 0 && (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 24, padding: '16px 0 4px', flexShrink: 0,
        }}>
          <ActionButton
            icon={XIcon}
            color="var(--accent)" bg="var(--accent-soft)"
            size={60} label="Passer"
            onClick={() => handleButtonSwipe('pass')}
          />
          <ActionButton
            icon={HeartIcon}
            color="var(--green)" bg="var(--green-soft)"
            size={72} label="Liker"
            onClick={() => handleButtonSwipe('like')}
          />
          <ActionButton
            icon={StarIcon}
            color="#FACC15" bg="rgba(250,204,21,0.12)"
            size={60} label="Super like"
          />
        </div>
      )}

      {/* Bottom nav spacer */}
      <div style={{ height: 88, flexShrink: 0 }} />
    </div>
  )
}

function Header({ likedCount: _likedCount }: { likedCount?: number }) {
  return (
    <div style={{ padding: '16px 20px 12px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em' }}>Fooder</h1>
        <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Paris · 2 km</span>
      </div>
    </div>
  )
}

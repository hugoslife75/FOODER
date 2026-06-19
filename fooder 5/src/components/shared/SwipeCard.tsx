import { useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { StarIcon, MapPinIcon } from '@/components/ui/Icons'
import type { PlaceWithDistance, SwipeDirection } from '@/types'

const SWIPE_THRESHOLD = 100

interface SwipeCardProps {
  place: PlaceWithDistance
  onSwipe: (placeId: string, direction: SwipeDirection) => void
  isTop: boolean
  stackIndex: number
}

export default function SwipeCard({ place, onSwipe, isTop, stackIndex }: SwipeCardProps) {
  const navigate = useNavigate()
  const x = useMotionValue(0)
  const isDragging = useRef(false)

  // Derived transforms from drag position
  const rotate    = useTransform(x, [-200, 200], [-18, 18])
  const likeOpacity = useTransform(x, [20, 100],  [0, 1])
  const passOpacity = useTransform(x, [-100, -20], [1, 0])

  const handleDragEnd = () => {
    isDragging.current = false
    const currentX = x.get()

    if (currentX > SWIPE_THRESHOLD) {
      // Fly out right
      animate(x, 700, { type: 'spring', stiffness: 200, damping: 25 })
      setTimeout(() => onSwipe(place.id, 'like'), 300)
    } else if (currentX < -SWIPE_THRESHOLD) {
      // Fly out left
      animate(x, -700, { type: 'spring', stiffness: 200, damping: 25 })
      setTimeout(() => onSwipe(place.id, 'pass'), 300)
    } else {
      // Snap back
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 })
    }
  }

  // Background card scaling
  const scale = isTop ? 1 : 0.94 + stackIndex * 0.03
  const translateY = isTop ? 0 : -stackIndex * 14

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale,
        translateY,
        zIndex: 10 - stackIndex,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: isTop ? 'grab' : 'default',
        boxShadow: isTop
          ? '0 32px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)'
          : '0 8px 32px rgba(0,0,0,0.3)',
        willChange: 'transform',
        userSelect: 'none',
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragStart={() => { isDragging.current = true }}
      onDragEnd={handleDragEnd}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* ── Image ───────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: '62%', overflow: 'hidden', background: 'var(--surface-elevated)' }}>
        <img
          src={place.image_url}
          alt={place.name}
          loading="lazy"
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }} />

        {/* LIKE badge */}
        <motion.div
          style={{
            position: 'absolute', top: 28, left: 28,
            opacity: likeOpacity,
            border: '2px solid var(--green)',
            background: 'var(--green-soft)',
            borderRadius: 12,
            padding: '8px 18px',
            rotate: -12,
          }}
        >
          <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 22, letterSpacing: '0.08em' }}>LIKE</span>
        </motion.div>

        {/* PASS badge */}
        <motion.div
          style={{
            position: 'absolute', top: 28, right: 28,
            opacity: passOpacity,
            border: '2px solid var(--accent)',
            background: 'var(--accent-soft)',
            borderRadius: 12,
            padding: '8px 18px',
            rotate: 12,
          }}
        >
          <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 22, letterSpacing: '0.08em' }}>PASS</span>
        </motion.div>

        {/* Distance chip */}
        <div style={{
          position: 'absolute', bottom: 14, right: 14,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
          borderRadius: 100, padding: '5px 12px',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <MapPinIcon size={12} color="var(--text-secondary)" />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
            {place.distance} km
          </span>
        </div>
      </div>

      {/* ── Info ────────────────────────────────────────────── */}
      <div style={{
        padding: '18px 22px 16px',
        background: 'var(--surface-elevated)',
        height: '38%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>{place.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <StarIcon size={14} color="#FACC15" filled />
              <span style={{ fontSize: 15, fontWeight: 600 }}>{place.rating_avg}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{place.cuisine_type}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{place.price_range}</span>
          </div>
          <p style={{
            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {place.description}
          </p>
        </div>

        {/* Tap to detail hint */}
        <button
          onPointerUp={() => {
            if (!isDragging.current) {
              navigate(`/restaurant/${place.id}`)
            }
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--text-tertiary)', fontSize: 12, fontWeight: 500,
            padding: 0,
          }}
        >
          <span>Voir le détail</span>
          <span>›</span>
        </button>
      </div>
    </motion.div>
  )
}

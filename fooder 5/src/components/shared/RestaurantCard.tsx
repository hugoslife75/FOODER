import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StarIcon, MapPinIcon } from '@/components/ui/Icons'
import type { PlaceWithDistance } from '@/types'

interface RestaurantCardProps {
  place: PlaceWithDistance
  isVisited?: boolean
  index?: number
}

export default function RestaurantCard({ place, isVisited, index = 0 }: RestaurantCardProps) {
  const navigate = useNavigate()

  return (
    <motion.button
      onClick={() => navigate(`/restaurant/${place.id}`)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 300, damping: 30 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex', gap: 14, padding: 14,
        background: 'var(--surface-elevated)',
        borderRadius: 'var(--radius)',
        border: '0.5px solid var(--border)',
        textAlign: 'left', width: '100%',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
    >
      {/* Thumbnail */}
      <div style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--surface)' }}>
        <img
          src={place.image_url}
          alt={place.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em' }}>{place.name}</h3>
            {isVisited && (
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: 'var(--green)',
                background: 'var(--green-soft)',
                padding: '2px 8px', borderRadius: 100,
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                Visité
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{place.cuisine_type}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <StarIcon size={12} color="#FACC15" filled />
            <span style={{ fontSize: 12, fontWeight: 500 }}>{place.rating_avg}</span>
          </div>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>·</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPinIcon size={12} color="var(--text-tertiary)" />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{place.distance} km</span>
          </div>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>·</span>
          <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{place.price_range}</span>
        </div>
      </div>
    </motion.button>
  )
}

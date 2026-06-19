import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { queryKeys } from '@/lib/queryClient'
import { getPlaceById } from '@/services/placesService'
import { useAuthContext } from '@/context/AuthContext'
import { useSwipe } from '@/hooks/useSwipe'
import { useVisits } from '@/hooks/useVisits'
import RatingStars from '@/components/ui/RatingStars'
import { Skeleton } from '@/components/ui/SkeletonLoader'
import {
  ChevronLeftIcon, HeartIcon, EyeIcon,
  MapPinIcon, StarIcon, CheckIcon,
} from '@/components/ui/Icons'

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthContext()

  const { likedIds, swipe } = useSwipe({ userId: user?.id ?? null })
  const { visitedIds, markVisited, isVisitPending } = useVisits({ userId: user?.id ?? null })

  const [showRatingForm, setShowRatingForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [justVisited, setJustVisited] = useState(false)

  const { data: place, isLoading } = useQuery({
    queryKey: queryKeys.places.detail(id ?? ''),
    queryFn: () => getPlaceById(id!),
    enabled: !!id,
  })

  const isLiked   = !!id && likedIds.has(id)
  const isVisited = !!id && (visitedIds.has(id) || justVisited)

  const handleLike = () => {
    if (id) swipe(id, 'like')
  }

  const handleOpenVisit = () => {
    if (!isVisited) setShowRatingForm(true)
  }

  const handleSubmitRating = async () => {
    if (!id || rating === 0) return
    await markVisited({ place_id: id, rating, review: review || undefined })
    setJustVisited(true)
    setShowRatingForm(false)
  }

  if (isLoading || !place) {
    return (
      <div style={{ height: '100%', background: 'var(--bg)' }}>
        <Skeleton height={300} borderRadius={0} />
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Skeleton height={32} width="60%" />
          <Skeleton height={16} width="40%" />
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="75%" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ height: '100%', overflowY: 'auto', background: 'var(--bg)' }}
    >
      {/* Hero */}
      <div style={{ position: 'relative', height: 300, flexShrink: 0 }}>
        <img
          src={place.image_url}
          alt={place.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.8) 100%)',
        }} />
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 52, left: 16,
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
            border: '0.5px solid var(--border-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ChevronLeftIcon size={20} color="#fff" />
        </button>

        <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <StarIcon size={14} color="#FACC15" filled />
              <span style={{ fontSize: 14, fontWeight: 600 }}>{place.rating_avg}</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
            <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{place.price_range}</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em' }}>{place.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 24px 160px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[place.cuisine_type, place.price_range].map((tag) => (
            <span key={tag} style={{
              display: 'inline-block', padding: '4px 12px',
              background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--border)',
              borderRadius: 100, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500,
            }}>{tag}</span>
          ))}
        </div>

        {/* Description */}
        <div>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            À propos
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {place.description}
          </p>
        </div>

        {/* Address */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px',
          background: 'var(--surface-elevated)',
          borderRadius: 'var(--radius-sm)',
          border: '0.5px solid var(--border)',
        }}>
          <MapPinIcon size={16} color="var(--text-tertiary)" />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{place.address}</span>
        </div>

        {/* Visit feedback */}
        <AnimatePresence>
          {justVisited && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 16px',
                background: 'var(--green-soft)',
                borderRadius: 'var(--radius-sm)',
                border: '0.5px solid rgba(34,197,94,0.3)',
              }}
            >
              <CheckIcon size={16} color="var(--green)" />
              <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 500 }}>Visite enregistrée</span>
            </motion.div>
          )}

          {showRatingForm && (
            <motion.div
              key="rating-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                padding: 20,
                background: 'var(--surface-elevated)',
                borderRadius: 'var(--radius)',
                border: '0.5px solid var(--border-strong)',
                display: 'flex', flexDirection: 'column', gap: 14,
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Ta note pour {place.name}</h3>
              <RatingStars value={rating} onChange={setRating} size={28} />
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Un avis ? (optionnel)"
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--bg)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.5,
                  resize: 'none', height: 80, outline: 'none',
                }}
              />
              <button
                onClick={handleSubmitRating}
                disabled={rating === 0 || isVisitPending}
                style={{
                  padding: '14px 0', borderRadius: 'var(--radius-sm)',
                  background: rating > 0 ? 'var(--green)' : 'var(--surface-elevated)',
                  color: rating > 0 ? '#fff' : 'var(--text-tertiary)',
                  fontSize: 14, fontWeight: 600,
                  transition: 'all 0.2s',
                  opacity: isVisitPending ? 0.6 : 1,
                }}
              >
                {isVisitPending ? 'Enregistrement…' : rating > 0 ? 'Enregistrer' : 'Donne une note d\'abord'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky bottom actions */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '16px 24px 36px',
        background: `linear-gradient(to top, var(--bg) 65%, transparent)`,
        display: 'flex', gap: 12,
        maxWidth: 390, margin: '0 auto',
      }}>
        {isLiked ? (
          <div style={{
            flex: 1, padding: '15px 0', borderRadius: 'var(--radius)',
            background: 'var(--green-soft)', border: '0.5px solid rgba(34,197,94,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <HeartIcon size={16} color="var(--green)" filled />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>Likée</span>
          </div>
        ) : (
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1, padding: '15px 0', borderRadius: 'var(--radius)',
              background: 'var(--accent-soft)', border: '0.5px solid rgba(255,77,109,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              color: 'var(--accent)', fontSize: 14, fontWeight: 600,
            }}
          >
            <HeartIcon size={16} color="var(--accent)" />
            Liker
          </motion.button>
        )}

        <motion.button
          onClick={handleOpenVisit}
          disabled={isVisited}
          whileTap={{ scale: isVisited ? 1 : 0.97 }}
          style={{
            flex: 1, padding: '15px 0', borderRadius: 'var(--radius)',
            background: 'var(--surface-elevated)',
            border: '0.5px solid var(--border-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: isVisited ? 'var(--text-tertiary)' : 'var(--text-primary)',
            fontSize: 14, fontWeight: 600,
            opacity: isVisited ? 0.6 : 1,
            cursor: isVisited ? 'default' : 'pointer',
          }}
        >
          <EyeIcon size={16} color={isVisited ? 'var(--text-tertiary)' : 'var(--text-primary)'} />
          {isVisited ? 'Visité' : 'Marquer visité'}
        </motion.button>
      </div>
    </motion.div>
  )
}

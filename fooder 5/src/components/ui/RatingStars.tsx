import { StarIcon } from '@/components/ui/Icons'

interface RatingStarsProps {
  value: number
  onChange?: (rating: number) => void
  size?: number
  readonly?: boolean
}

export default function RatingStars({ value, onChange, size = 24, readonly = false }: RatingStarsProps) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          style={{
            padding: 2,
            cursor: readonly ? 'default' : 'pointer',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!readonly) (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'
          }}
          onMouseLeave={(e) => {
            if (!readonly) (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
          }}
        >
          <StarIcon
            size={size}
            color={star <= value ? '#FACC15' : 'var(--text-tertiary)'}
            filled={star <= value}
          />
        </button>
      ))}
    </div>
  )
}

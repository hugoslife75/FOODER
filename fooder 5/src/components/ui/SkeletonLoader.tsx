interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  style?: React.CSSProperties
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style = {} }: SkeletonProps) {
  return (
    <div style={{
      width, height, borderRadius,
      background: 'linear-gradient(90deg, var(--surface-elevated) 25%, rgba(255,255,255,0.04) 50%, var(--surface-elevated) 75%)',
      backgroundSize: '400px 100%',
      animation: 'shimmer 1.4s ease infinite',
      ...style,
    }} />
  )
}

export function SwipeCardSkeleton() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--surface-elevated)',
    }}>
      <Skeleton height="62%" borderRadius={0} />
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton height={28} width="55%" />
        <Skeleton height={14} width="38%" />
        <Skeleton height={13} width="85%" />
        <Skeleton height={13} width="70%" />
      </div>
    </div>
  )
}

export function RestaurantCardSkeleton() {
  return (
    <div style={{
      display: 'flex', gap: 14, padding: 14,
      background: 'var(--surface-elevated)',
      borderRadius: 'var(--radius)',
      border: '0.5px solid var(--border)',
    }}>
      <Skeleton width={80} height={80} borderRadius={10} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
        <Skeleton height={16} width="60%" />
        <Skeleton height={12} width="40%" />
        <Skeleton height={12} width="50%" />
      </div>
    </div>
  )
}

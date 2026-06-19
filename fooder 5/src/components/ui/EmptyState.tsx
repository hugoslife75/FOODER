interface EmptyStateProps {
  emoji: string
  title: string
  subtitle: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ emoji, title, subtitle, action }: EmptyStateProps) {
  return (
    <div
      className="animate-fade-in"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        gap: 16,
        textAlign: 'center',
      }}
    >
      <div style={{
        width: 72, height: 72,
        borderRadius: 22,
        background: 'var(--surface-elevated)',
        border: '0.5px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32,
      }}>
        {emoji}
      </div>
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {title}
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          {subtitle}
        </p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: 8, padding: '12px 24px',
            background: 'var(--accent-soft)',
            border: '0.5px solid rgba(255,77,109,0.3)',
            borderRadius: 'var(--radius)',
            color: 'var(--accent)', fontSize: 14, fontWeight: 600,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

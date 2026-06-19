import { useState } from 'react'
import { motion } from 'framer-motion'
import { signInWithMagicLink } from '@/services/authService'

type AuthState = 'idle' | 'loading' | 'sent' | 'error'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [authState, setAuthState] = useState<AuthState>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!email.includes('@')) {
      setError('Adresse email invalide.')
      return
    }
    setAuthState('loading')
    setError(null)

    try {
      await signInWithMagicLink(email)
      setAuthState('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
      setAuthState('error')
    }
  }

  if (authState === 'sent') {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 40, gap: 20, textAlign: 'center',
      }}>
        <div style={{ fontSize: 48 }}>✉️</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>
          Vérifie tes emails
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          On a envoyé un lien de connexion à<br />
          <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
        </p>
        <button
          onClick={() => setAuthState('idle')}
          style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: 3 }}
        >
          Renvoyer un lien
        </button>
      </div>
    )
  }

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: '80px 32px 52px', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
          Bienvenue<br />sur Fooder
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Connecte-toi avec ton email. Pas de mot de passe.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: 8 }}>
            Adresse email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="toi@example.com"
            style={{
              width: '100%', padding: '14px 16px',
              background: 'var(--surface-elevated)',
              border: '0.5px solid var(--border-strong)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)', fontSize: 15,
              outline: 'none',
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: 13, color: 'var(--accent)' }}>{error}</p>
        )}

        <motion.button
          onClick={handleSubmit}
          disabled={authState === 'loading'}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', padding: '17px 0',
            borderRadius: 'var(--radius)',
            background: 'var(--accent)', color: '#fff',
            fontSize: 15, fontWeight: 600,
            opacity: authState === 'loading' ? 0.6 : 1,
            boxShadow: '0 8px 32px var(--accent-glow)',
          }}
        >
          {authState === 'loading' ? 'Envoi…' : 'Recevoir un lien de connexion'}
        </motion.button>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.6 }}>
        En continuant, tu acceptes nos CGU et notre politique de confidentialité.
      </p>
    </div>
  )
}

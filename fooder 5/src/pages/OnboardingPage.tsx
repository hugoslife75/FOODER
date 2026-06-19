import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LightningIcon, HeartIcon, MapPinIcon } from '@/components/ui/Icons'

const STEPS = [
  {
    Icon: LightningIcon,
    title: 'Découvre les\nrestaurants\nautour de toi',
    subtitle: 'Fooder te propose les meilleures tables dans un rayon de 2 km.',
    cta: 'Commencer',
  },
  {
    Icon: HeartIcon,
    title: 'Swipe pour\ntrouver ta\nprochaine table',
    subtitle: 'Swipe à droite pour liker, à gauche pour passer. Simple et addictif.',
    cta: "J'ai compris",
  },
  {
    Icon: MapPinIcon,
    title: 'Partage ta\nposition',
    subtitle: 'Pour voir les restaurants proches de toi, Fooder a besoin de ta localisation.',
    cta: 'Autoriser la localisation',
  },
] as const

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const { Icon, title, subtitle, cta } = STEPS[step]

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      navigate('/feed')
    }
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '80px 32px 52px',
      justifyContent: 'space-between',
      background: 'var(--bg)',
    }}>
      {/* Dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            animate={{ width: i === step ? 20 : 6 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              height: 6, borderRadius: 3,
              background: i === step ? 'var(--accent)' : 'var(--border)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        >
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'var(--accent-soft)',
            border: '0.5px solid rgba(255,77,109,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={32} color="var(--accent)" />
          </div>

          <h1 style={{
            fontSize: 38, fontWeight: 700, letterSpacing: '-0.04em',
            lineHeight: 1.1, whiteSpace: 'pre-line',
          }}>
            {title}
          </h1>

          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 280 }}>
            {subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <motion.button
        onClick={handleNext}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%', padding: '18px 0',
          borderRadius: 'var(--radius)',
          background: 'var(--accent)', color: '#fff',
          fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em',
          boxShadow: '0 8px 32px var(--accent-glow)',
        }}
      >
        {cta}
      </motion.button>
    </div>
  )
}

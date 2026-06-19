import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartIcon, HomeIcon, UserIcon } from '@/components/ui/Icons'
import { useSwipe } from '@/hooks/useSwipe'
import { useAuthContext } from '@/context/AuthContext'

const NAV_ITEMS = [
  { path: '/feed',    label: 'Discover', Icon: HomeIcon  },
  { path: '/favoris', label: 'Favoris',  Icon: HeartIcon },
  { path: '/profil',  label: 'Profil',   Icon: UserIcon  },
] as const

export default function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { likedIds } = useSwipe({ userId: user?.id ?? null })

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      position: 'relative',
    }}>
      {/* Page content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <nav style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '12px 24px 32px',
        background: 'linear-gradient(to top, var(--bg) 55%, transparent)',
        display: 'flex',
        justifyContent: 'space-around',
        zIndex: 100,
      }}>
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                padding: '8px 20px', borderRadius: 'var(--radius)',
                background: isActive ? 'var(--accent-soft)' : 'transparent',
                border: isActive ? '0.5px solid rgba(255,77,109,0.3)' : '0.5px solid transparent',
                transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                position: 'relative',
              }}
            >
              <Icon
                size={20}
                color={isActive ? 'var(--accent)' : 'var(--text-tertiary)'}
                filled={isActive}
              />
              <span style={{
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
              }}>
                {label}
              </span>

              {/* Badge on Favoris */}
              {path === '/favoris' && likedIds.size > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute', top: 6, right: 14,
                    width: 16, height: 16, borderRadius: '50%',
                    background: 'var(--accent)', color: '#fff',
                    fontSize: 9, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {likedIds.size}
                </motion.div>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

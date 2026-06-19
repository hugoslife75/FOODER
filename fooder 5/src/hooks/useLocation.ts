import { useState, useEffect, useCallback } from 'react'
import type { Coordinates } from '@/types'

// Fallback city coordinates
const CITY_COORDINATES: Record<string, Coordinates> = {
  paris: { latitude: 48.8566, longitude: 2.3522 },
  lyon: { latitude: 45.7640, longitude: 4.8357 },
  marseille: { latitude: 43.2965, longitude: 5.3698 },
  bordeaux: { latitude: 44.8378, longitude: -0.5792 },
  lille: { latitude: 50.6292, longitude: 3.0573 },
  nice: { latitude: 43.7102, longitude: 7.2620 },
  toulouse: { latitude: 43.6047, longitude: 1.4442 },
  nantes: { latitude: 47.2184, longitude: -1.5536 },
  strasbourg: { latitude: 48.5734, longitude: 7.7521 },
  rennes: { latitude: 48.1173, longitude: -1.6778 },
}

type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error'

interface LocationState {
  coords: Coordinates | null
  status: LocationStatus
  error: string | null
  requestLocation: () => void
  setManualCity: (city: string) => void
}

export function useLocation(): LocationState {
  const [coords, setCoords] = useState<Coordinates | null>(null)
  const [status, setStatus] = useState<LocationStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('denied')
      setError('La géolocalisation n\'est pas supportée par ce navigateur.')
      return
    }

    setStatus('requesting')
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setStatus('granted')
      },
      (err) => {
        console.warn('[useLocation] Geolocation denied:', err.message)
        setStatus('denied')
        setError('Accès à la localisation refusé.')
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 1000 * 60 * 5, // Cache for 5 minutes
      }
    )
  }, [])

  const setManualCity = useCallback((city: string) => {
    const normalised = city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const found = CITY_COORDINATES[normalised]

    if (found) {
      setCoords(found)
      setStatus('granted')
      setError(null)
    } else {
      setError(`Ville non reconnue : "${city}". Essaie Paris, Lyon, Marseille…`)
    }
  }, [])

  // Auto-request on mount (silent — no prompt if already granted)
  useEffect(() => {
    if (!navigator.permissions) {
      requestLocation()
      return
    }

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((result) => {
        if (result.state === 'granted') {
          requestLocation()
        }
      })
      .catch(() => {
        // permissions API not available — skip silent check
      })
  }, [requestLocation])

  return { coords, status, error, requestLocation, setManualCity }
}

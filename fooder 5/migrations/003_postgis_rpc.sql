-- ============================================================
-- Fooder — Migration 003: places_within_radius RPC
-- Uses PostGIS for accurate server-side geo filtering.
-- Fallback (Haversine client-side) works without this.
-- ============================================================

-- Enable PostGIS (skip if already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geometry column to places
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS location GEOMETRY(POINT, 4326);

-- Populate geometry from existing lat/lng rows
UPDATE public.places
SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE location IS NULL;

-- Auto-populate geometry on new inserts
CREATE OR REPLACE FUNCTION public.sync_place_location()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_place_location ON public.places;

CREATE TRIGGER trg_sync_place_location
  BEFORE INSERT OR UPDATE OF latitude, longitude ON public.places
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_place_location();

-- Spatial index
CREATE INDEX IF NOT EXISTS places_location_idx
  ON public.places USING GIST (location);

-- ── RPC exposed to the client ────────────────────────────────
CREATE OR REPLACE FUNCTION public.places_within_radius(
  user_lat  FLOAT,
  user_lng  FLOAT,
  radius_km FLOAT DEFAULT 2
)
RETURNS TABLE (
  id           UUID,
  created_at   TIMESTAMPTZ,
  name         TEXT,
  description  TEXT,
  address      TEXT,
  latitude     FLOAT,
  longitude    FLOAT,
  image_url    TEXT,
  cuisine_type TEXT,
  price_range  TEXT,
  rating_avg   FLOAT,
  distance     FLOAT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    p.id,
    p.created_at,
    p.name,
    p.description,
    p.address,
    p.latitude,
    p.longitude,
    p.image_url,
    p.cuisine_type,
    p.price_range,
    p.rating_avg,
    ROUND(
      (ST_Distance(
        p.location::geography,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
      ) / 1000)::NUMERIC,
      1
    )::FLOAT AS distance
  FROM public.places p
  WHERE
    ST_DWithin(
      p.location::geography,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_km * 1000  -- convert km → metres
    )
  ORDER BY distance ASC;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.places_within_radius TO authenticated;

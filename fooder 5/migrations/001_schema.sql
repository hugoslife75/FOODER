-- ============================================================
-- Fooder — Migration 001: Schema
-- Run in Supabase SQL Editor
-- ============================================================

-- ── Enable UUID extension ──────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── users ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email      TEXT NOT NULL UNIQUE,
  username   TEXT,
  avatar_url TEXT
);

-- ── places ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.places (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name         TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  address      TEXT NOT NULL DEFAULT '',
  latitude     FLOAT NOT NULL,
  longitude    FLOAT NOT NULL,
  image_url    TEXT NOT NULL DEFAULT '',
  cuisine_type TEXT NOT NULL DEFAULT '',
  price_range  TEXT NOT NULL DEFAULT '€',
  rating_avg   FLOAT NOT NULL DEFAULT 0
);

-- Index for geo queries
CREATE INDEX IF NOT EXISTS places_lat_lng_idx ON public.places (latitude, longitude);

-- ── swipes ────────────────────────────────────────────────
CREATE TYPE IF NOT EXISTS swipe_direction AS ENUM ('like', 'pass');

CREATE TABLE IF NOT EXISTS public.swipes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  place_id   UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  direction  swipe_direction NOT NULL,

  -- A user can swipe a restaurant exactly once
  CONSTRAINT swipes_user_place_unique UNIQUE (user_id, place_id)
);

CREATE INDEX IF NOT EXISTS swipes_user_id_idx   ON public.swipes (user_id);
CREATE INDEX IF NOT EXISTS swipes_place_id_idx  ON public.swipes (place_id);

-- ── visits ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.visits (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  place_id   UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review     TEXT
);

CREATE INDEX IF NOT EXISTS visits_user_id_idx   ON public.visits (user_id);
CREATE INDEX IF NOT EXISTS visits_place_id_idx  ON public.visits (place_id);

-- ── Row Level Security ─────────────────────────────────────
ALTER TABLE public.users  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Users: read own row, insert/update own row
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Places: readable by all authenticated users
CREATE POLICY "places_select_authenticated" ON public.places
  FOR SELECT TO authenticated USING (true);

-- Swipes: own rows only
CREATE POLICY "swipes_select_own" ON public.swipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "swipes_insert_own" ON public.swipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Visits: own rows only
CREATE POLICY "visits_select_own" ON public.visits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "visits_insert_own" ON public.visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

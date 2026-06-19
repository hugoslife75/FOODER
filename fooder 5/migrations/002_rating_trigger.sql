-- ============================================================
-- Fooder — Migration 002: rating_avg trigger
-- Automatically updates places.rating_avg after each visit insert.
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_place_rating_avg()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.places
  SET rating_avg = (
    SELECT ROUND(AVG(rating)::NUMERIC, 1)
    FROM public.visits
    WHERE place_id = NEW.place_id
  )
  WHERE id = NEW.place_id;

  RETURN NEW;
END;
$$;

-- Trigger fires after every INSERT into visits
DROP TRIGGER IF EXISTS trg_update_place_rating_avg ON public.visits;

CREATE TRIGGER trg_update_place_rating_avg
  AFTER INSERT ON public.visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_place_rating_avg();

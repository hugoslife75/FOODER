-- ============================================================
-- Fooder — Migration 004: Seed places (Paris demo data)
-- ============================================================

INSERT INTO public.places
  (name, description, address, latitude, longitude, image_url, cuisine_type, price_range, rating_avg)
VALUES
  (
    'Septime',
    'Table de référence du Paris bistronomique. Produits d''exception, cuisine vivante et saisonnière signée Bertrand Grébaut.',
    '80 Rue de Charonne, 75011 Paris',
    48.8529, 2.3791,
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    'Bistronomie', '€€€', 4.8
  ),
  (
    'Le Grand Bain',
    'Cuisine végétale et marine dans un cadre chaleureux de Belleville. Menu éphémère renouvelé chaque semaine.',
    '14 Rue Denoyez, 75020 Paris',
    48.8697, 2.3843,
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    'Néobistro', '€€', 4.6
  ),
  (
    'Frenchie',
    'Greg Marchand réinvente la tradition franco-anglaise avec une précision et une générosité qui font de Frenchie une institution moderne.',
    '5 Rue du Nil, 75002 Paris',
    48.8639, 2.3481,
    'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80',
    'Franco-anglais', '€€€', 4.7
  ),
  (
    'Dépôt Légal',
    'Les meilleures pizzas napoletaines de Paris. Pâte fermentée 48h, four à bois, garnitures sourcées en Italie.',
    '21 Rue des Trois Frères, 75018 Paris',
    48.8847, 2.3431,
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    'Pizzeria napolitaine', '€€', 4.5
  ),
  (
    'Clown Bar',
    'Carreaux de faïence Art Déco, abats sublimes et vins de collection. Une adresse hors du temps à deux pas du Cirque d''Hiver.',
    '114 Rue Amelot, 75011 Paris',
    48.8573, 2.3685,
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    'Bistro de nez', '€€€', 4.9
  ),
  (
    'Mokonuts',
    'Omar Dhiab et Moko Hirayama livrent midi et soir une cuisine du Levant lumineuse et sincère. Les cookies sont légendaires.',
    '5 Rue Saint-Bernard, 75011 Paris',
    48.8524, 2.3738,
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'Cuisine du Levant', '€€', 4.7
  )
ON CONFLICT DO NOTHING;

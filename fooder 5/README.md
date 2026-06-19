# Fooder 🍜

Application mobile web-first de découverte de restaurants par swipe.

## Stack

| Couche | Technologie |
|--------|-------------|
| UI | React 18 + TypeScript |
| Bundler | Vite |
| Animations | Framer Motion |
| Data fetching | TanStack Query v5 |
| Backend | Supabase (Auth + Database + Storage) |
| Routing | React Router v6 |

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/your-org/fooder
cd fooder
npm install
```

### 2. Créer ton projet Supabase

1. Va sur [supabase.com](https://supabase.com) → New project
2. Copie le **Project URL** et l'**anon public key** depuis Settings > API

### 3. Variables d'environnement

```bash
cp .env.example .env.local
```

Remplis `.env.local` :

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 4. Appliquer les migrations SQL

Dans le **SQL Editor** de Supabase, exécute dans l'ordre :

```
migrations/001_schema.sql        → Tables, contraintes, RLS
migrations/002_rating_trigger.sql → Trigger rating_avg
migrations/003_postgis_rpc.sql   → Fonction geo radius (optionnel)
migrations/004_seed.sql          → Données de démo Paris
```

> **Note :** La migration 003 nécessite PostGIS. Si ton plan Supabase ne le supporte pas,
> l'app bascule automatiquement sur le fallback Haversine côté client.

### 5. Lancer l'app

```bash
npm run dev
```

---

## Architecture

```
src/
├── pages/               # Écrans de l'app
│   ├── OnboardingPage.tsx
│   ├── AuthPage.tsx
│   ├── FeedPage.tsx
│   ├── FavorisPage.tsx
│   ├── ProfilPage.tsx
│   └── RestaurantDetailPage.tsx
│
├── components/
│   ├── shared/          # Composants métier réutilisables
│   │   ├── SwipeCard.tsx
│   │   ├── RestaurantCard.tsx
│   │   └── AppShell.tsx
│   └── ui/              # Composants UI purs
│       ├── Icons.tsx
│       ├── SkeletonLoader.tsx
│       ├── EmptyState.tsx
│       └── RatingStars.tsx
│
├── services/            # Logique Supabase (aucune logique UI)
│   ├── authService.ts
│   ├── placesService.ts
│   ├── swipesService.ts
│   └── visitsService.ts
│
├── hooks/               # React Query wrappers
│   ├── useAuth.ts
│   ├── useLocation.ts
│   ├── usePlaces.ts
│   ├── useSwipe.ts
│   └── useVisits.ts
│
├── context/
│   └── AuthContext.tsx
│
├── types/
│   └── index.ts         # Types stricts, aucune any
│
└── lib/
    ├── supabaseClient.ts
    ├── database.types.ts
    ├── queryClient.ts
    └── geo.ts
```

---

## Modèle de données

```
users        id · email · username · avatar_url
places       id · name · description · address · lat · lng · image_url · cuisine_type · price_range · rating_avg
swipes       id · user_id → users · place_id → places · direction ('like'|'pass')
visits       id · user_id → users · place_id → places · rating (1-5) · review
```

### Règles métier

- `swipes(user_id, place_id)` — contrainte UNIQUE → un swipe par restaurant par utilisateur
- `rating_avg` — mis à jour automatiquement par trigger SQL après chaque `INSERT` dans `visits`
- Les restaurants affichés sont filtrés à 2 km via PostGIS RPC (fallback Haversine)
- Un restaurant peut être noté uniquement s'il est marqué comme "Visité"

---

## Génération des types Supabase

Pour regénérer `src/lib/database.types.ts` à partir de ton schéma :

```bash
npx supabase gen types typescript --project-id <your-project-id> \
  > src/lib/database.types.ts
```

---

## Scripts

```bash
npm run dev          # Serveur de dev
npm run build        # Build de production (TypeScript check + Vite)
npm run type-check   # Vérification TypeScript seule
npm run preview      # Prévisualiser le build
```

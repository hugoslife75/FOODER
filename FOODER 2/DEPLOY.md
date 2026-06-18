# Fooder — Guide de déploiement complet

## Prérequis

- Node 18+ (`node --version`)
- Compte [Supabase](https://supabase.com) (free tier suffisant)
- Compte [Vercel](https://vercel.com) ou [Netlify](https://netlify.com) (gratuit)

---

## Étape 1 — Créer le projet Supabase

1. Aller sur [app.supabase.com](https://app.supabase.com) → **New project**
2. Choisir une région proche (ex : `eu-west-1`)
3. Récupérer dans **Settings > API** :
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`

---

## Étape 2 — Appliquer les migrations SQL

Dans **Supabase SQL Editor**, coller et exécuter dans l'ordre :

### 001 — Schéma de base
Copier-coller le contenu de `migrations/001_schema.sql`

### 002 — Trigger rating_avg
Copier-coller le contenu de `migrations/002_rating_trigger.sql`

### 003 — PostGIS (optionnel, recommandé)
Copier-coller le contenu de `migrations/003_postgis_rpc.sql`

> Si ton plan ne supporte pas PostGIS, skip cette étape.
> L'app bascule automatiquement sur le calcul Haversine côté client.

### 004 — Données de démo
Copier-coller le contenu de `migrations/004_seed.sql`

---

## Étape 3 — Variables d'environnement

```bash
cp .env.example .env.local
```

Remplir `.env.local` :

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## Étape 4 — Générer les types TypeScript (optionnel mais recommandé)

```bash
npx supabase login
npx supabase gen types typescript \
  --project-id <ton-project-id> \
  > src/lib/database.types.ts
```

---

## Étape 5 — Lancer en local

```bash
npm install
npm run dev
# → http://localhost:5173
```

---

## Étape 6 — Build de production

```bash
npm run build
# → dist/
```

---

## Étape 7 — Déployer sur Vercel

```bash
npm install -g vercel
vercel --prod
```

Ajouter les variables d'env dans le dashboard Vercel :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Ou déployer sur Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Ajouter dans **Site settings > Build & deploy > Environment variables**.

---

## Étape 8 — Configurer l'auth Supabase

Dans **Supabase > Authentication > URL Configuration** :
- **Site URL** → `https://ton-domaine.vercel.app`
- **Redirect URLs** → `https://ton-domaine.vercel.app/**`

---

## Checklist avant mise en prod

- [ ] Migrations 001 et 002 appliquées
- [ ] RLS activé sur toutes les tables (inclus dans 001)
- [ ] Variables d'env configurées sur l'hébergeur
- [ ] Site URL et Redirect URLs configurés dans Supabase Auth
- [ ] `npm run build` passe sans erreur
- [ ] `npm run type-check` retourne 0 erreur

---

## Regénérer les types après modification du schéma

```bash
npx supabase gen types typescript \
  --project-id <project-id> \
  > src/lib/database.types.ts
```


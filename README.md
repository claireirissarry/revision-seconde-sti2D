# Le Panthéon des Bâtisseuses

Application de révision accessible (DYS / TDAH) pour préparer l'entrée en 1ère STI2D :
maths et physique-chimie de seconde, présentés en texte FALC, audio (lecture à voix haute
avec surlignage), vidéo et schéma, dans un univers de femmes fortes (chevalière, astronaute,
médecin, ingénieure...) façon carte à reconstruire, avec une interface inspirée d'Instagram.

## Stack

React + TypeScript + Vite, Tailwind CSS, Framer Motion, React Router, Supabase
(`@supabase/supabase-js`).

## Installer et lancer en local

```bash
npm install
cp .env.example .env.local   # puis renseigne tes clés Supabase (voir ci-dessous)
npm run dev
```

L'application fonctionne même sans Supabase configuré : elle bascule automatiquement sur
le contenu local (`src/data/*.json`) et la progression est alors uniquement stockée dans le
navigateur (localStorage). Configure Supabase dès que tu veux que la progression de l'élève
se synchronise entre plusieurs appareils.

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production (vérifie aussi les types avec `tsc`)
- `npm run preview` — prévisualise le build de production
- `npm run seed` — synchronise `src/data/*.json` vers Supabase (chapitres + quiz)

## Créer le projet Supabase

1. Crée un projet sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL du projet, exécute le contenu de `supabase/schema.sql` (tables +
   Row Level Security).
3. Dans **Project Settings > API**, récupère :
   - `Project URL` → `VITE_SUPABASE_URL` (et `SUPABASE_URL` pour le seed)
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`
   - `service_role key` (secrète) → `SUPABASE_SERVICE_ROLE_KEY`, uniquement pour `npm run seed`,
     jamais dans le code ni commitée.
4. Renseigne ces 4 valeurs dans `.env.local` (jamais commité, voir `.env.example`).
5. Lance `npm run seed` pour charger les chapitres et quiz de démonstration dans Supabase.
6. Active l'authentification par lien magique (Email OTP) dans **Authentication > Providers**.

### Compte parent/enseignant (lecture seule)

Pour lier un compte parent à un compte élève, insère une ligne dans
`liens_parent_eleve (parent_user_id, eleve_user_id)` une fois les deux comptes créés. Le
compte parent n'a alors accès qu'en lecture à la progression de l'élève lié (RLS), sans note
chiffrée — uniquement des niveaux : découverte / en cours / maîtrisé.

## Ajouter des chapitres

Le contenu est éditable dans `src/data/chapitres.maths.json` et `chapitres.physique.json`
(un objet par chapitre, voir les exemples "fonction-affine" et "loi-ohm"), et les questions
associées dans `src/data/quiz.json`. Après modification, relance `npm run seed` pour
synchroniser vers Supabase. Pense à compléter le champ `formats.video.url` avec l'URL YouTube
la plus adaptée (chaînes Yvan Monka pour les maths, Paul Olivier pour la physique-chimie).

### Police DYS (optionnel)

Le switch de police propose "Police standard" (Lexend, chargée via Google Fonts) et
"Police DYS" (OpenDyslexic). OpenDyslexic n'étant pas distribuée via un CDN public standard,
télécharge ses fichiers `.woff2` (licence SIL Open Font License, libre) et place-les dans
`public/fonts/OpenDyslexic-Regular.woff2` pour activer le rendu — sans ce fichier, l'app
retombe simplement sur Lexend.

## Déployer sur Vercel

1. Pousse le repo sur GitHub (voir ci-dessous).
2. Sur [vercel.com](https://vercel.com), clique **Add New Project** et importe le repo — le
   preset Vite est détecté automatiquement, aucune configuration manuelle nécessaire.
3. Dans **Settings > Environment Variables**, ajoute `VITE_SUPABASE_URL` et
   `VITE_SUPABASE_ANON_KEY` (les mêmes valeurs que dans `.env.local`). N'ajoute jamais
   `SUPABASE_SERVICE_ROLE_KEY` sur Vercel, elle ne sert qu'au seed en local.
4. Déploie. `vercel.json` gère déjà le rewrite SPA nécessaire pour React Router.

## Pousser sur GitHub

```bash
git init
git add .
git commit -m "Premier commit"
git branch -M main
git remote add origin <url-de-ton-repo>
git push -u origin main
```

## Structure du projet

```
src/
  components/   composants réutilisables (feed, notion, quiz, mascotte, badges, focus, accessibilité)
  context/      accessibilité, auth, mode focus, ambiance audio
  data/         contenu pédagogique en JSON (source de vérité éditable)
  hooks/        accès Supabase + fallback local (chapitres, progression, streak, badges)
  lib/          client Supabase, synthèse vocale, utilitaires
  pages/        écrans de l'application
  types/        types TypeScript du contenu et de la base
supabase/
  schema.sql    tables + Row Level Security
  seed.ts       synchronise src/data/*.json vers Supabase
```

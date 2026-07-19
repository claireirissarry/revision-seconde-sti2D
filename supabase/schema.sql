-- Le Panthéon des Bâtisseuses — schéma Supabase (Postgres)
-- À exécuter dans l'éditeur SQL de ton projet Supabase, ou via `supabase db push`.

-- =========================================================
-- Contenu pédagogique (lecture publique, pas de données perso)
-- =========================================================

create table if not exists chapitres (
  id text primary key,
  matiere text not null check (matiere in ('maths', 'physique-chimie')),
  theme text not null,
  titre text not null,
  ordre int not null default 0,
  duree_estimee_min int not null default 10,
  badge_sti2d boolean not null default false,
  justification_sti2d text,
  resume_falc jsonb not null default '[]'::jsonb, -- [{ id, texte }]
  video_url text,
  video_titre text,
  video_duree_min int,
  schema_type text check (schema_type in ('svg', 'image')),
  schema_src text,
  schema_alt text,
  schema_legende_falc text,
  mascotte_id text not null
);

create table if not exists quiz_questions (
  id text primary key,
  chapitre_id text not null references chapitres (id) on delete cascade,
  question text not null,
  choix jsonb not null, -- string[]
  bonne_reponse int not null,
  indice text not null,
  explication_falc text not null
);

-- =========================================================
-- Données élève (RLS : chacun ne voit que les siennes)
-- =========================================================

create table if not exists progression_eleve (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  chapitre_id text not null references chapitres (id) on delete cascade,
  statut text not null default 'decouverte' check (statut in ('decouverte', 'en_cours', 'maitrise')),
  score int,
  date_derniere_revision timestamptz,
  unique (user_id, chapitre_id)
);

create table if not exists streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  jours_consecutifs int not null default 0,
  dernier_jour_actif date,
  boucliers_restants int not null default 2
);

create table if not exists badges_debloques (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_id text not null,
  date_obtention timestamptz not null default now(),
  unique (user_id, badge_id)
);

-- Lien de lecture seule entre un compte parent/enseignant et un compte élève
create table if not exists liens_parent_eleve (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users (id) on delete cascade,
  eleve_user_id uuid not null references auth.users (id) on delete cascade,
  unique (parent_user_id, eleve_user_id)
);

-- =========================================================
-- Row Level Security
-- =========================================================

alter table chapitres enable row level security;
alter table quiz_questions enable row level security;
alter table progression_eleve enable row level security;
alter table streaks enable row level security;
alter table badges_debloques enable row level security;
alter table liens_parent_eleve enable row level security;

-- Contenu pédagogique : lecture publique pour tout utilisateur connecté
create policy "chapitres lecture publique" on chapitres
  for select using (true);

create policy "quiz lecture publique" on quiz_questions
  for select using (true);

-- Progression : l'élève lit/écrit uniquement sa propre progression
create policy "eleve lit sa progression" on progression_eleve
  for select using (auth.uid() = user_id);

create policy "eleve modifie sa progression" on progression_eleve
  for insert with check (auth.uid() = user_id);

create policy "eleve met a jour sa progression" on progression_eleve
  for update using (auth.uid() = user_id);

-- Streaks : idem
create policy "eleve lit sa streak" on streaks
  for select using (auth.uid() = user_id);

create policy "eleve modifie sa streak" on streaks
  for insert with check (auth.uid() = user_id);

create policy "eleve met a jour sa streak" on streaks
  for update using (auth.uid() = user_id);

-- Badges débloqués : idem
create policy "eleve lit ses badges" on badges_debloques
  for select using (auth.uid() = user_id);

create policy "eleve debloque ses badges" on badges_debloques
  for insert with check (auth.uid() = user_id);

-- Lien parent/élève : chacun voit ses propres liens
create policy "parent lit ses liens" on liens_parent_eleve
  for select using (auth.uid() = parent_user_id or auth.uid() = eleve_user_id);

-- Parent : accès lecture seule à la progression de l'élève lié
create policy "parent lit la progression de son eleve" on progression_eleve
  for select using (
    exists (
      select 1 from liens_parent_eleve l
      where l.eleve_user_id = progression_eleve.user_id
        and l.parent_user_id = auth.uid()
    )
  );

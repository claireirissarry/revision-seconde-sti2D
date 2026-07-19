// Script de seed : synchronise src/data/*.json vers Supabase.
// Utilise la clé service_role (jamais exposée au client) pour bypasser la RLS
// sur les tables de contenu public.
//
// Usage : npm run seed
// Variables requises dans .env.local (en plus des VITE_* pour l'app) :
//   SUPABASE_URL=... (identique à VITE_SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY=... (Project Settings > API > service_role, SECRET)

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function chargerDotEnvLocal(): void {
  const chemin = resolve(process.cwd(), ".env.local");
  if (!existsSync(chemin)) return;

  for (const ligne of readFileSync(chemin, "utf-8").split("\n")) {
    const propre = ligne.trim();
    if (!propre || propre.startsWith("#")) continue;
    const indexEgal = propre.indexOf("=");
    if (indexEgal === -1) continue;
    const cle = propre.slice(0, indexEgal).trim();
    const valeur = propre.slice(indexEgal + 1).trim();
    if (!(cle in process.env)) process.env[cle] = valeur;
  }
}

chargerDotEnvLocal();

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Manque SUPABASE_URL et/ou SUPABASE_SERVICE_ROLE_KEY dans .env.local. Voir supabase/seed.ts pour le détail."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

async function seed() {
  const chapitresMaths = JSON.parse(
    readFileSync(resolve(process.cwd(), "src/data/chapitres.maths.json"), "utf-8")
  );
  const chapitresPhysique = JSON.parse(
    readFileSync(resolve(process.cwd(), "src/data/chapitres.physique.json"), "utf-8")
  );
  const quiz = JSON.parse(readFileSync(resolve(process.cwd(), "src/data/quiz.json"), "utf-8"));

  const chapitres = [...chapitresMaths, ...chapitresPhysique].map((c: any) => ({
    id: c.id,
    matiere: c.matiere,
    theme: c.theme,
    titre: c.titre,
    ordre: c.ordre,
    duree_estimee_min: c.dureeEstimeeMin,
    badge_sti2d: c.essentielSTI2D,
    justification_sti2d: c.justificationSTI2D ?? null,
    resume_falc: c.formats.texte.blocs,
    video_url: c.formats.video.url || null,
    video_titre: c.formats.video.titre,
    video_duree_min: c.formats.video.dureeMin,
    schema_type: c.formats.schema.type,
    schema_src: c.formats.schema.src,
    schema_alt: c.formats.schema.alt,
    schema_legende_falc: c.formats.schema.legendeFalc ?? null,
    mascotte_id: c.mascotteId,
  }));

  console.log(`Seed de ${chapitres.length} chapitre(s)...`);
  const { error: erreurChapitres } = await supabase.from("chapitres").upsert(chapitres, {
    onConflict: "id",
  });
  if (erreurChapitres) throw erreurChapitres;

  const questions = (quiz as any[]).map((q) => ({
    id: q.id,
    chapitre_id: q.chapitreId,
    question: q.question,
    choix: q.choix,
    bonne_reponse: q.bonneReponseIndex,
    indice: q.indice,
    explication_falc: q.explicationFalc,
  }));

  console.log(`Seed de ${questions.length} question(s) de quiz...`);
  const { error: erreurQuiz } = await supabase.from("quiz_questions").upsert(questions, {
    onConflict: "id",
  });
  if (erreurQuiz) throw erreurQuiz;

  console.log("Seed terminé ✨");
}

seed().catch((erreur) => {
  console.error("Échec du seed :", erreur);
  process.exit(1);
});

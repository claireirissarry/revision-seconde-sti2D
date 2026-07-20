import { useEffect, useState } from "react";
import { supabase, supabaseConfigure } from "../lib/supabaseClient";
import type { Chapitre, Exercice, Matiere, QuizQuestion } from "../types/content";
import chapitresMaths from "../data/chapitres.maths.json";
import chapitresPhysique from "../data/chapitres.physique.json";
import quizLocal from "../data/quiz.json";
import exercicesLocal from "../data/exercices.json";

const chapitresLocaux: Chapitre[] = [
  ...(chapitresMaths as Chapitre[]),
  ...(chapitresPhysique as Chapitre[]),
];

interface LigneChapitreDB {
  id: string;
  matiere: string;
  theme: string;
  titre: string;
  ordre: number;
  duree_estimee_min: number;
  badge_sti2d: boolean;
  justification_sti2d: string | null;
  resume_falc: { id: string; texte: string }[];
  video_url: string | null;
  video_titre: string | null;
  video_duree_min: number | null;
  schema_type: "svg" | "image" | null;
  schema_src: string | null;
  schema_alt: string | null;
  schema_legende_falc: string | null;
  mascotte_id: string;
}

function versChapitre(ligne: LigneChapitreDB): Chapitre {
  return {
    id: ligne.id,
    matiere: ligne.matiere as Matiere,
    theme: ligne.theme,
    titre: ligne.titre,
    ordre: ligne.ordre,
    dureeEstimeeMin: ligne.duree_estimee_min,
    essentielSTI2D: ligne.badge_sti2d,
    justificationSTI2D: ligne.justification_sti2d ?? undefined,
    formats: {
      texte: { blocs: ligne.resume_falc ?? [] },
      video: {
        url: ligne.video_url ?? "",
        titre: ligne.video_titre ?? "",
        dureeMin: ligne.video_duree_min ?? 0,
      },
      schema: {
        type: ligne.schema_type ?? "svg",
        src: ligne.schema_src ?? "",
        alt: ligne.schema_alt ?? "",
        legendeFalc: ligne.schema_legende_falc ?? undefined,
      },
    },
    mascotteId: ligne.mascotte_id,
  };
}

export function useChapitres(matiere?: Matiere) {
  const [chapitres, setChapitres] = useState<Chapitre[]>(
    filtrer(chapitresLocaux, matiere)
  );
  const [chargement, setChargement] = useState(supabaseConfigure);

  useEffect(() => {
    if (!supabaseConfigure) return;

    let annule = false;
    setChargement(true);

    async function charger() {
      let requete = supabase.from("chapitres").select("*").order("ordre");
      if (matiere) requete = requete.eq("matiere", matiere);

      const { data, error } = await requete;
      if (annule) return;

      if (error || !data || data.length === 0) {
        setChapitres(filtrer(chapitresLocaux, matiere));
      } else {
        setChapitres((data as unknown as LigneChapitreDB[]).map(versChapitre));
      }
      setChargement(false);
    }

    void charger();
    return () => {
      annule = true;
    };
  }, [matiere]);

  return { chapitres, chargement };
}

export function useQuiz(chapitreId: string) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    (quizLocal as QuizQuestion[]).filter((q) => q.chapitreId === chapitreId)
  );

  useEffect(() => {
    if (!supabaseConfigure) return;
    let annule = false;

    async function charger() {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("chapitre_id", chapitreId);

      if (annule) return;

      if (error || !data || data.length === 0) {
        setQuestions(
          (quizLocal as QuizQuestion[]).filter((q) => q.chapitreId === chapitreId)
        );
      } else {
        setQuestions(
          data.map((ligne) => ({
            id: ligne.id,
            chapitreId: ligne.chapitre_id,
            question: ligne.question,
            choix: ligne.choix,
            bonneReponseIndex: ligne.bonne_reponse,
            indice: ligne.indice,
            explicationFalc: ligne.explication_falc,
          }))
        );
      }
    }

    void charger();
    return () => {
      annule = true;
    };
  }, [chapitreId]);

  return questions;
}

export function useExercice(chapitreId: string) {
  const trouverLocal = () =>
    (exercicesLocal as Exercice[]).find((e) => e.chapitreId === chapitreId) ?? null;

  const [exercice, setExercice] = useState<Exercice | null>(trouverLocal);

  useEffect(() => {
    if (!supabaseConfigure) return;
    let annule = false;

    async function charger() {
      const { data, error } = await supabase
        .from("exercices")
        .select("*")
        .eq("chapitre_id", chapitreId)
        .maybeSingle();

      if (annule) return;

      if (error || !data) {
        setExercice(trouverLocal());
      } else {
        setExercice({
          id: data.id,
          chapitreId: data.chapitre_id,
          enonce: data.enonce,
          questions: data.questions,
        });
      }
    }

    void charger();
    return () => {
      annule = true;
    };
  }, [chapitreId]);

  return exercice;
}

function filtrer(chapitres: Chapitre[], matiere?: Matiere): Chapitre[] {
  return matiere ? chapitres.filter((c) => c.matiere === matiere) : chapitres;
}

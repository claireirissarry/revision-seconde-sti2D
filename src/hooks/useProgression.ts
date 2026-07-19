import { useCallback, useEffect, useState } from "react";
import { supabase, supabaseConfigure } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import type { ProgressionEleve, StatutMaitrise } from "../types/content";
import { aujourdhuiISO } from "../lib/utils";

const STOCKAGE_CLE = "panthéon-progression-locale";

function chargerProgressionLocale(): Record<string, ProgressionEleve> {
  if (typeof window === "undefined") return {};
  try {
    const brut = window.localStorage.getItem(STOCKAGE_CLE);
    return brut ? JSON.parse(brut) : {};
  } catch {
    return {};
  }
}

function sauvegarderProgressionLocale(progression: Record<string, ProgressionEleve>) {
  window.localStorage.setItem(STOCKAGE_CLE, JSON.stringify(progression));
}

export function useProgression() {
  const { session } = useAuth();
  const [progression, setProgression] = useState<Record<string, ProgressionEleve>>(
    chargerProgressionLocale
  );

  useEffect(() => {
    if (!supabaseConfigure || !session) return;
    let annule = false;

    async function charger() {
      const { data, error } = await supabase
        .from("progression_eleve")
        .select("*")
        .eq("user_id", session!.user.id);

      if (annule || error || !data) return;

      const map: Record<string, ProgressionEleve> = {};
      for (const ligne of data) {
        map[ligne.chapitre_id] = {
          chapitreId: ligne.chapitre_id,
          statut: ligne.statut as StatutMaitrise,
          score: ligne.score,
          dateDerniereRevision: ligne.date_derniere_revision,
        };
      }
      setProgression(map);
    }

    void charger();
    return () => {
      annule = true;
    };
  }, [session]);

  const enregistrerProgression = useCallback(
    async (chapitreId: string, statut: StatutMaitrise, score: number | null) => {
      const entree: ProgressionEleve = {
        chapitreId,
        statut,
        score,
        dateDerniereRevision: aujourdhuiISO(),
      };

      setProgression((prec) => {
        const suivant = { ...prec, [chapitreId]: entree };
        sauvegarderProgressionLocale(suivant);
        return suivant;
      });

      if (supabaseConfigure && session) {
        await supabase.from("progression_eleve").upsert(
          {
            user_id: session.user.id,
            chapitre_id: chapitreId,
            statut,
            score,
            date_derniere_revision: entree.dateDerniereRevision,
          },
          { onConflict: "user_id,chapitre_id" }
        );
      }
    },
    [session]
  );

  return { progression, enregistrerProgression };
}

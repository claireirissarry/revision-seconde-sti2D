import { useCallback, useEffect, useState } from "react";
import { supabase, supabaseConfigure } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import type { Streak } from "../types/content";
import { aujourdhuiISO } from "../lib/utils";

const STOCKAGE_CLE = "panthéon-streak-locale";
const BOUCLIERS_INITIAUX = 2;

function streakParDefaut(): Streak {
  return { joursConsecutifs: 0, dernierJourActif: null, boucliersRestants: BOUCLIERS_INITIAUX };
}

function chargerStreakLocale(): Streak {
  if (typeof window === "undefined") return streakParDefaut();
  try {
    const brut = window.localStorage.getItem(STOCKAGE_CLE);
    return brut ? JSON.parse(brut) : streakParDefaut();
  } catch {
    return streakParDefaut();
  }
}

function joursEntre(dateA: string, dateB: string): number {
  const msParJour = 1000 * 60 * 60 * 24;
  return Math.round((new Date(dateB).getTime() - new Date(dateA).getTime()) / msParJour);
}

/** Calcule la nouvelle streak après une session du jour, avec un bouclier pour les jours ratés. */
function avancerStreak(streak: Streak): Streak {
  const aujourdhui = aujourdhuiISO();
  if (streak.dernierJourActif === aujourdhui) return streak;

  if (!streak.dernierJourActif) {
    return { ...streak, joursConsecutifs: 1, dernierJourActif: aujourdhui };
  }

  const ecart = joursEntre(streak.dernierJourActif, aujourdhui);

  if (ecart === 1) {
    return { ...streak, joursConsecutifs: streak.joursConsecutifs + 1, dernierJourActif: aujourdhui };
  }

  if (ecart === 2 && streak.boucliersRestants > 0) {
    return {
      joursConsecutifs: streak.joursConsecutifs + 1,
      dernierJourActif: aujourdhui,
      boucliersRestants: streak.boucliersRestants - 1,
    };
  }

  return { joursConsecutifs: 1, dernierJourActif: aujourdhui, boucliersRestants: BOUCLIERS_INITIAUX };
}

export function useStreak() {
  const { session } = useAuth();
  const [streak, setStreak] = useState<Streak>(chargerStreakLocale);

  useEffect(() => {
    if (!supabaseConfigure || !session) return;
    let annule = false;

    async function charger() {
      const { data, error } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", session!.user.id)
        .maybeSingle();

      if (annule || error || !data) return;

      setStreak({
        joursConsecutifs: data.jours_consecutifs,
        dernierJourActif: data.dernier_jour_actif,
        boucliersRestants: data.boucliers_restants,
      });
    }

    void charger();
    return () => {
      annule = true;
    };
  }, [session]);

  const enregistrerSessionDuJour = useCallback(async () => {
    const nouvelleStreak = avancerStreak(streak);
    setStreak(nouvelleStreak);
    window.localStorage.setItem(STOCKAGE_CLE, JSON.stringify(nouvelleStreak));

    if (supabaseConfigure && session) {
      await supabase.from("streaks").upsert(
        {
          user_id: session.user.id,
          jours_consecutifs: nouvelleStreak.joursConsecutifs,
          dernier_jour_actif: nouvelleStreak.dernierJourActif,
          boucliers_restants: nouvelleStreak.boucliersRestants,
        },
        { onConflict: "user_id" }
      );
    }

    return nouvelleStreak;
  }, [streak, session]);

  return { streak, enregistrerSessionDuJour };
}

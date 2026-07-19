import { useCallback, useEffect, useState } from "react";
import { supabase, supabaseConfigure } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const STOCKAGE_CLE = "panthéon-badges-locaux";

function chargerBadgesLocaux(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const brut = window.localStorage.getItem(STOCKAGE_CLE);
    return brut ? JSON.parse(brut) : [];
  } catch {
    return [];
  }
}

export function useBadges() {
  const { session } = useAuth();
  const [idsDebloques, setIdsDebloques] = useState<Set<string>>(() => new Set(chargerBadgesLocaux()));

  useEffect(() => {
    if (!supabaseConfigure || !session) return;
    let annule = false;

    async function charger() {
      const { data, error } = await supabase
        .from("badges_debloques")
        .select("*")
        .eq("user_id", session!.user.id);

      if (annule || error || !data) return;
      setIdsDebloques(new Set(data.map((b) => b.badge_id)));
    }

    void charger();
    return () => {
      annule = true;
    };
  }, [session]);

  const debloquerBadge = useCallback(
    async (badgeId: string) => {
      let debloqueMaintenant = false;

      setIdsDebloques((prec) => {
        if (prec.has(badgeId)) return prec;
        debloqueMaintenant = true;
        const suivant = new Set(prec).add(badgeId);
        window.localStorage.setItem(STOCKAGE_CLE, JSON.stringify([...suivant]));
        return suivant;
      });

      if (debloqueMaintenant && supabaseConfigure && session) {
        await supabase.from("badges_debloques").upsert(
          { user_id: session.user.id, badge_id: badgeId },
          { onConflict: "user_id,badge_id" }
        );
      }

      return debloqueMaintenant;
    },
    [session]
  );

  return { idsDebloques, debloquerBadge };
}

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useChapitres } from "../hooks/useChapitres";
import { supabase, supabaseConfigure } from "../lib/supabaseClient";
import type { StatutMaitrise } from "../types/content";

const LIBELLE_STATUT: Record<StatutMaitrise, string> = {
  decouverte: "Découverte",
  en_cours: "En cours",
  maitrise: "Maîtrisé",
};

export default function ParentDashboard() {
  const { session, role } = useAuth();
  const { chapitres } = useChapitres();
  const [progressionEleve, setProgressionEleve] = useState<Record<string, StatutMaitrise>>({});

  useEffect(() => {
    if (!supabaseConfigure || !session || role !== "parent") return;
    let annule = false;

    async function charger() {
      const { data: liens } = await supabase
        .from("liens_parent_eleve")
        .select("eleve_user_id")
        .eq("parent_user_id", session!.user.id);

      const eleveId = liens?.[0]?.eleve_user_id;
      if (!eleveId) return;

      const { data: progression } = await supabase
        .from("progression_eleve")
        .select("*")
        .eq("user_id", eleveId);

      if (annule || !progression) return;
      setProgressionEleve(
        Object.fromEntries(progression.map((p) => [p.chapitre_id, p.statut as StatutMaitrise]))
      );
    }

    void charger();
    return () => {
      annule = true;
    };
  }, [session, role]);

  if (role !== "parent") {
    return (
      <p className="text-sm text-ink/70">
        Ce tableau de bord est réservé aux comptes parent/enseignant en lecture seule.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-titre text-2xl font-bold">Suivi (lecture seule)</h1>
      <p className="text-sm text-ink/70">
        Des niveaux de maîtrise, jamais de notes chiffrées, pour rester serein·e.
      </p>
      <ul className="space-y-2">
        {chapitres.map((chapitre) => (
          <li key={chapitre.id} className="flex items-center justify-between rounded-xl bg-ivoire-soft p-3">
            <span>{chapitre.titre}</span>
            <span className="text-sm font-medium">
              {LIBELLE_STATUT[progressionEleve[chapitre.id] ?? "decouverte"]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

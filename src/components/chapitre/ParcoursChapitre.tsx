import { useState } from "react";
import type { Chapitre, Mascotte, Badge, StatutMaitrise } from "../../types/content";
import { NotionCard } from "../notion/NotionCard";
import { Quiz } from "../quiz/Quiz";
import { Exercice } from "../quiz/Exercice";
import { BadgeUnlockModal } from "../badges/BadgeUnlockModal";
import { useProgression } from "../../hooks/useProgression";
import { useBadges } from "../../hooks/useBadges";
import { useExercice } from "../../hooks/useChapitres";
import { calculerBadgesDebloques } from "../../lib/badges";
import badgesData from "../../data/badges.json";

const badges = badgesData as Badge[];

type Etape = "cours" | "quiz" | "exercice" | "termine";

interface Resultat {
  score: number;
  total: number;
}

export function ParcoursChapitre({ chapitre, mascotte }: { chapitre: Chapitre; mascotte: Mascotte }) {
  const { progression, enregistrerProgression } = useProgression();
  const { idsDebloques, debloquerBadge } = useBadges();
  const exercice = useExercice(chapitre.id);

  const [etape, setEtape] = useState<Etape>("cours");
  const [resultatQuiz, setResultatQuiz] = useState<Resultat | null>(null);
  const [resultatExercice, setResultatExercice] = useState<Resultat | null>(null);
  const [pourcentageFinal, setPourcentageFinal] = useState<number | null>(null);
  const [fileBadges, setFileBadges] = useState<Badge[]>([]);

  const dernierResultat = progression[chapitre.id];

  async function terminerChapitre() {
    const totalGeneral = (resultatQuiz?.total ?? 0) + (resultatExercice?.total ?? 0);
    const scoreGeneral = (resultatQuiz?.score ?? 0) + (resultatExercice?.score ?? 0);
    const pourcentage = totalGeneral > 0 ? Math.round((scoreGeneral / totalGeneral) * 100) : 0;
    const statut: StatutMaitrise = "maitrise";

    await enregistrerProgression(chapitre.id, statut, pourcentage);

    const nouveauxBadges = calculerBadgesDebloques(chapitre.id, statut, progression, badges, idsDebloques);
    for (const badge of nouveauxBadges) {
      await debloquerBadge(badge.id);
    }
    if (nouveauxBadges.length > 0) setFileBadges(nouveauxBadges);

    setPourcentageFinal(pourcentage);
    setEtape("termine");
  }

  return (
    <div className="space-y-6">
      <NotionCard chapitre={chapitre} />

      {dernierResultat?.score != null && etape === "cours" && (
        <p className="rounded-xl bg-ivoire-soft p-3 text-sm">
          Dernier résultat sur ce chapitre : <strong>{dernierResultat.score}%</strong> de bonnes
          réponses au premier essai.
        </p>
      )}

      {etape === "cours" && (
        <button
          type="button"
          onClick={() => setEtape("quiz")}
          className="min-h-11 w-full rounded-2xl bg-maths px-4 py-3 font-semibold text-white"
        >
          J'ai terminé le cours → Passer à l'exercice
        </button>
      )}

      {etape === "quiz" && (
        <div className="space-y-4">
          <Quiz
            chapitreId={chapitre.id}
            mascotte={mascotte}
            onTermine={(score, total) => setResultatQuiz({ score, total })}
          />
          {resultatQuiz && (
            <button
              type="button"
              onClick={() => (exercice ? setEtape("exercice") : void terminerChapitre())}
              className="min-h-11 w-full rounded-2xl bg-physique px-4 py-3 font-semibold text-white"
            >
              {exercice ? "Continuer vers l'exercice niveau seconde" : "Terminer le chapitre"}
            </button>
          )}
        </div>
      )}

      {etape === "exercice" && exercice && (
        <div className="space-y-4">
          <Exercice
            exercice={exercice}
            mascotte={mascotte}
            onTermine={(score, total) => setResultatExercice({ score, total })}
          />
          {resultatExercice && (
            <button
              type="button"
              onClick={() => void terminerChapitre()}
              className="min-h-11 w-full rounded-2xl bg-physique px-4 py-3 font-semibold text-white"
            >
              Terminer le chapitre ✅
            </button>
          )}
        </div>
      )}

      {etape === "termine" && pourcentageFinal !== null && (
        <div className="space-y-2 rounded-2xl bg-ivoire-soft p-4 text-center">
          <p className="font-titre text-2xl font-bold">{pourcentageFinal}% de réussite 🎉</p>
          <p className="text-sm text-ink/70">Chapitre terminé, bravo pour ton travail !</p>
        </div>
      )}

      <BadgeUnlockModal
        badge={fileBadges[0] ?? null}
        onFermer={() => setFileBadges((prec) => prec.slice(1))}
      />
    </div>
  );
}

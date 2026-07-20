import { useState } from "react";
import type { DureeSessionMin } from "../context/FocusModeContext";
import { useFocusMode } from "../context/FocusModeContext";
import { useChapitres } from "../hooks/useChapitres";
import { useProgression } from "../hooks/useProgression";
import { useBadges } from "../hooks/useBadges";
import { calculerBadgesDebloques } from "../lib/badges";
import { FocusSession } from "../components/focus/FocusSession";
import { NotionCard } from "../components/notion/NotionCard";
import { Quiz } from "../components/quiz/Quiz";
import { BadgeUnlockModal } from "../components/badges/BadgeUnlockModal";
import type { Mascotte, Badge, StatutMaitrise } from "../types/content";
import mascottesData from "../data/mascottes.json";
import badgesData from "../data/badges.json";

const mascottes = mascottesData as Mascotte[];
const badges = badgesData as Badge[];
const DUREES: DureeSessionMin[] = [5, 10, 15];

export default function FocusSessionPage() {
  const { focusActif, demarrerFocus } = useFocusMode();
  const { chapitres } = useChapitres();
  const { progression, enregistrerProgression } = useProgression();
  const { idsDebloques, debloquerBadge } = useBadges();
  const [fileBadges, setFileBadges] = useState<Badge[]>([]);

  const chapitreCible =
    chapitres.find((c) => progression[c.id]?.statut !== "maitrise") ?? chapitres[0];
  const mascotte = chapitreCible ? mascottes.find((m) => m.id === chapitreCible.mascotteId) : undefined;

  if (!focusActif) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="font-titre text-2xl font-bold">Choisis ta durée de session</h1>
        <p className="text-sm text-ink/70">Une seule notion à la fois, à ton rythme.</p>
        <div className="flex justify-center gap-3">
          {DUREES.map((duree) => (
            <button
              key={duree}
              type="button"
              onClick={() => demarrerFocus(duree)}
              className="min-h-11 min-w-20 rounded-2xl bg-maths px-4 py-3 font-semibold text-white"
            >
              {duree} min
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!chapitreCible || !mascotte) {
    return <p>Bravo, tu as déjà tout révisé pour l'instant ! ✨</p>;
  }

  async function surQuizTermine(score: number, total: number) {
    const statut: StatutMaitrise = score === total ? "maitrise" : score > 0 ? "en_cours" : "decouverte";
    await enregistrerProgression(chapitreCible!.id, statut, score);

    const nouveauxBadges = calculerBadgesDebloques(chapitreCible!.id, statut, progression, badges, idsDebloques);
    for (const badge of nouveauxBadges) {
      await debloquerBadge(badge.id);
    }
    if (nouveauxBadges.length > 0) setFileBadges(nouveauxBadges);
  }

  return (
    <FocusSession>
      <NotionCard chapitre={chapitreCible} />
      <Quiz chapitreId={chapitreCible.id} mascotte={mascotte} onTermine={surQuizTermine} />
      <BadgeUnlockModal
        badge={fileBadges[0] ?? null}
        onFermer={() => setFileBadges((prec) => prec.slice(1))}
      />
    </FocusSession>
  );
}

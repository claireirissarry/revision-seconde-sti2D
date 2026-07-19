import type { DureeSessionMin } from "../context/FocusModeContext";
import { useFocusMode } from "../context/FocusModeContext";
import { useChapitres } from "../hooks/useChapitres";
import { useProgression } from "../hooks/useProgression";
import { FocusSession } from "../components/focus/FocusSession";
import { NotionCard } from "../components/notion/NotionCard";
import { Quiz } from "../components/quiz/Quiz";
import type { Mascotte } from "../types/content";
import mascottesData from "../data/mascottes.json";

const mascottes = mascottesData as Mascotte[];
const DUREES: DureeSessionMin[] = [5, 10, 15];

export default function FocusSessionPage() {
  const { focusActif, demarrerFocus } = useFocusMode();
  const { chapitres } = useChapitres();
  const { progression, enregistrerProgression } = useProgression();

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

  return (
    <FocusSession>
      <NotionCard chapitre={chapitreCible} />
      <Quiz
        chapitreId={chapitreCible.id}
        mascotte={mascotte}
        onTermine={(score, total) => {
          const statut = score === total ? "maitrise" : score > 0 ? "en_cours" : "decouverte";
          void enregistrerProgression(chapitreCible.id, statut, score);
        }}
      />
    </FocusSession>
  );
}

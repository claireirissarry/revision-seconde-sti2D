import { useState } from "react";
import type { ExerciceQuestion } from "../../types/content";
import { cx, melangerChoix } from "../../lib/utils";

const CHANCES_MAX = 2;

interface Props {
  question: ExerciceQuestion;
  onReussite: (reussi: boolean) => void;
}

export function QuizQuestionCard({ question, onReussite }: Props) {
  const [{ choix, bonneReponseIndex }] = useState(() =>
    melangerChoix(question.choix, question.bonneReponseIndex)
  );
  const [choixSelectionne, setChoixSelectionne] = useState<number | null>(null);
  const [nbEssais, setNbEssais] = useState(0);
  const [reussi, setReussi] = useState(false);

  const chancesEpuisees = !reussi && nbEssais >= CHANCES_MAX;
  const termine = reussi || chancesEpuisees;

  function repondre(index: number) {
    if (termine) return;
    setChoixSelectionne(index);
    if (index === bonneReponseIndex) {
      setReussi(true);
    } else {
      setNbEssais((n) => n + 1);
    }
  }

  const afficherIndice = nbEssais >= 1 && !termine;

  return (
    <div className="space-y-4 rounded-2xl bg-ivoire-soft p-4">
      <p className="font-medium">{question.question}</p>

      <div className="grid gap-2" role="group" aria-label="Choix de réponse">
        {choix.map((choixItem, index) => {
          const estSelectionne = choixSelectionne === index;
          const estBonneReponse = index === bonneReponseIndex;
          return (
            <button
              key={choixItem}
              type="button"
              onClick={() => repondre(index)}
              disabled={termine}
              aria-pressed={estSelectionne}
              className={cx(
                "min-h-11 rounded-xl border-2 px-4 py-3 text-left font-medium transition-colors",
                termine && estBonneReponse && "border-physique bg-physique-light",
                !termine && estSelectionne && "border-arcenciel-corail bg-arcenciel-corail/10",
                !(termine && estBonneReponse) && !(estSelectionne && !termine) && "border-ivoire-soft bg-white"
              )}
            >
              {choixItem}
            </button>
          );
        })}
      </div>

      {!termine && choixSelectionne !== null && (
        <p className="text-sm">Presque ! Il te reste un essai, on réessaie ?</p>
      )}

      {afficherIndice && (
        <p className="rounded-xl bg-arcenciel-miel/30 p-3 text-sm">💡 Indice : {question.indice}</p>
      )}

      {chancesEpuisees && (
        <p className="text-sm">Pas de souci, regardons ensemble la bonne réponse 👇</p>
      )}

      {termine && (
        <div className="space-y-3">
          <p className="text-sm">{question.explicationFalc}</p>
          <button
            type="button"
            onClick={() => onReussite(reussi)}
            className="min-h-11 w-full rounded-xl bg-maths px-4 py-3 font-semibold text-white"
          >
            Continuer
          </button>
        </div>
      )}
    </div>
  );
}

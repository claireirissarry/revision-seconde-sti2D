import { useState } from "react";
import type { QuizQuestion } from "../../types/content";
import { cx } from "../../lib/utils";

interface Props {
  question: QuizQuestion;
  onReussite: () => void;
}

export function QuizQuestionCard({ question, onReussite }: Props) {
  const [choixSelectionne, setChoixSelectionne] = useState<number | null>(null);
  const [nbEssais, setNbEssais] = useState(0);
  const [reussi, setReussi] = useState(false);

  function repondre(index: number) {
    setChoixSelectionne(index);
    if (index === question.bonneReponseIndex) {
      setReussi(true);
    } else {
      setNbEssais((n) => n + 1);
    }
  }

  const afficherIndice = nbEssais >= 1 && !reussi;

  return (
    <div className="space-y-4 rounded-2xl bg-ivoire-soft p-4">
      <p className="font-medium">{question.question}</p>

      <div className="grid gap-2" role="group" aria-label="Choix de réponse">
        {question.choix.map((choix, index) => {
          const estSelectionne = choixSelectionne === index;
          const estBonneReponse = index === question.bonneReponseIndex;
          return (
            <button
              key={choix}
              type="button"
              onClick={() => repondre(index)}
              disabled={reussi}
              aria-pressed={estSelectionne}
              className={cx(
                "min-h-11 rounded-xl border-2 px-4 py-3 text-left font-medium transition-colors",
                reussi && estBonneReponse && "border-physique bg-physique-light",
                !reussi && estSelectionne && "border-arcenciel-corail bg-arcenciel-corail/10",
                !(reussi && estBonneReponse) && !(estSelectionne && !reussi) && "border-ivoire-soft bg-white"
              )}
            >
              {choix}
            </button>
          );
        })}
      </div>

      {!reussi && choixSelectionne !== null && (
        <p className="text-sm">Presque ! On réessaie ensemble ?</p>
      )}

      {afficherIndice && (
        <p className="rounded-xl bg-arcenciel-miel/30 p-3 text-sm">💡 Indice : {question.indice}</p>
      )}

      {reussi && (
        <div className="space-y-3">
          <p className="text-sm">{question.explicationFalc}</p>
          <button
            type="button"
            onClick={onReussite}
            className="min-h-11 w-full rounded-xl bg-maths px-4 py-3 font-semibold text-white"
          >
            Continuer
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import type { Exercice as ExerciceType, Mascotte } from "../../types/content";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { QuizResult } from "./QuizResult";

interface Props {
  exercice: ExerciceType;
  mascotte: Mascotte;
  onTermine: (score: number, total: number) => void;
}

export function Exercice({ exercice, mascotte, onTermine }: Props) {
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [termine, setTermine] = useState(false);

  if (termine) {
    return <QuizResult mascotte={mascotte} score={score} total={exercice.questions.length} />;
  }

  const question = exercice.questions[indexQuestion];

  function passerALaSuite(premierEssaiReussi: boolean) {
    const nouveauScore = score + (premierEssaiReussi ? 1 : 0);
    setScore(nouveauScore);
    if (indexQuestion + 1 >= exercice.questions.length) {
      setTermine(true);
      onTermine(nouveauScore, exercice.questions.length);
    } else {
      setIndexQuestion((i) => i + 1);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-dashed border-arcenciel-lavande bg-white/60 p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/60">
          Exercice niveau seconde
        </p>
        <p className="text-sm">{exercice.enonce}</p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={indexQuestion + 1}
        aria-valuemin={1}
        aria-valuemax={exercice.questions.length}
        aria-label={`Question ${indexQuestion + 1} sur ${exercice.questions.length}`}
        className="h-2 w-full overflow-hidden rounded-full bg-ivoire-soft"
      >
        <div
          className="h-full bg-degrade-arcenciel transition-all"
          style={{ width: `${((indexQuestion + 1) / exercice.questions.length) * 100}%` }}
        />
      </div>
      <QuizQuestionCard key={question.id} question={question} onReussite={passerALaSuite} />
    </div>
  );
}

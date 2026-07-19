import { useState } from "react";
import type { Mascotte } from "../../types/content";
import { useQuiz } from "../../hooks/useChapitres";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { QuizResult } from "./QuizResult";

interface Props {
  chapitreId: string;
  mascotte: Mascotte;
  onTermine?: (score: number, total: number) => void;
}

export function Quiz({ chapitreId, mascotte, onTermine }: Props) {
  const questions = useQuiz(chapitreId);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [termine, setTermine] = useState(false);

  if (questions.length === 0) {
    return <p className="text-sm text-ink/70">Quiz bientôt disponible pour ce chapitre.</p>;
  }

  if (termine) {
    return <QuizResult mascotte={mascotte} score={score} total={questions.length} />;
  }

  const question = questions[indexQuestion];

  function passerALaSuite() {
    const nouveauScore = score + 1;
    setScore(nouveauScore);
    if (indexQuestion + 1 >= questions.length) {
      setTermine(true);
      onTermine?.(nouveauScore, questions.length);
    } else {
      setIndexQuestion((i) => i + 1);
    }
  }

  return (
    <div className="space-y-3">
      <div
        role="progressbar"
        aria-valuenow={indexQuestion + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-label={`Question ${indexQuestion + 1} sur ${questions.length}`}
        className="h-2 w-full overflow-hidden rounded-full bg-ivoire-soft"
      >
        <div
          className="h-full bg-degrade-arcenciel transition-all"
          style={{ width: `${((indexQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>
      <QuizQuestionCard key={question.id} question={question} onReussite={passerALaSuite} />
    </div>
  );
}

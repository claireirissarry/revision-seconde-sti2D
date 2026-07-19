import type { Mascotte } from "../../types/content";
import { MascotteMessage } from "../mascotte/MascotteMessage";

export function QuizResult({ mascotte, score, total }: { mascotte: Mascotte; score: number; total: number }) {
  return (
    <div className="space-y-4 text-center">
      <p className="font-titre text-2xl font-bold">
        {score} / {total} 🎉
      </p>
      <MascotteMessage mascotte={mascotte} contexte="reussite" />
    </div>
  );
}

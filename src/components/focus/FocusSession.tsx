import { useEffect, useState, type ReactNode } from "react";
import { useFocusMode } from "../../context/FocusModeContext";
import { TimerRing } from "./TimerRing";
import { BreathingPause } from "./BreathingPause";

export function FocusSession({ children }: { children: ReactNode }) {
  const { dureeChoisieMin, arreterFocus } = useFocusMode();
  const secondesTotal = dureeChoisieMin * 60;
  const [secondesRestantes, setSecondesRestantes] = useState(secondesTotal);
  const [enPause, setEnPause] = useState(false);

  useEffect(() => {
    if (enPause) return;
    if (secondesRestantes <= 0) {
      setEnPause(true);
      return;
    }
    const intervalle = setInterval(() => {
      setSecondesRestantes((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(intervalle);
  }, [secondesRestantes, enPause]);

  if (enPause) {
    return <BreathingPause onTerminer={arreterFocus} />;
  }

  return (
    <div className="space-y-6">
      <TimerRing secondesRestantes={secondesRestantes} secondesTotal={secondesTotal} />
      {children}
      <button
        type="button"
        onClick={() => setEnPause(true)}
        className="mx-auto block min-h-11 rounded-xl bg-ivoire-soft px-4 py-2 text-sm font-medium"
      >
        Terminer la session maintenant
      </button>
    </div>
  );
}

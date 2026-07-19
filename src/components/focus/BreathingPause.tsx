import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAccessibility } from "../../context/AccessibilityContext";

const DUREE_SECONDES = 30;

export function BreathingPause({ onTerminer }: { onTerminer: () => void }) {
  const { animationsActivees } = useAccessibility();
  const [secondesRestantes, setSecondesRestantes] = useState(DUREE_SECONDES);

  useEffect(() => {
    const intervalle = setInterval(() => {
      setSecondesRestantes((s) => {
        if (s <= 1) {
          clearInterval(intervalle);
          onTerminer();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalle);
  }, [onTerminer]);

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <p className="font-titre text-xl font-bold">Petite pause respiration 🌬️</p>
      <motion.div
        className="h-24 w-24 rounded-full bg-degrade-arcenciel"
        animate={animationsActivees ? { scale: [1, 1.3, 1] } : undefined}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <p>Inspire... expire... Encore {secondesRestantes} secondes.</p>
      <button
        type="button"
        onClick={onTerminer}
        className="min-h-11 rounded-xl bg-ivoire-soft px-4 py-2 text-sm font-medium"
      >
        Passer la pause
      </button>
    </div>
  );
}

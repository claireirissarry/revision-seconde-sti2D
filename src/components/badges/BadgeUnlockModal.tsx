import { motion, AnimatePresence } from "framer-motion";
import type { Badge } from "../../types/content";
import { useAccessibility } from "../../context/AccessibilityContext";

export function BadgeUnlockModal({ badge, onFermer }: { badge: Badge | null; onFermer: () => void }) {
  const { animationsActivees } = useAccessibility();

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          role="alertdialog"
          aria-labelledby="titre-badge-debloque"
          aria-describedby="description-badge-debloque"
          initial={animationsActivees ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6"
        >
          <motion.div
            initial={animationsActivees ? { scale: 0.85, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xs space-y-3 rounded-3xl bg-ivoire p-6 text-center"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-degrade-arcenciel text-4xl">
              <span aria-hidden="true">{badge.icone}</span>
            </div>
            <h2 id="titre-badge-debloque" className="font-titre text-lg font-bold">
              Nouveau portrait débloqué : {badge.titre} ✨
            </h2>
            <p id="description-badge-debloque" className="text-sm">
              {badge.description}
            </p>
            <button
              type="button"
              onClick={onFermer}
              className="min-h-11 w-full rounded-xl bg-maths px-4 py-3 font-semibold text-white"
            >
              Continuer l'aventure
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

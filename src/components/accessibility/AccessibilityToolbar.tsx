import { useState } from "react";
import { useAccessibility } from "../../context/AccessibilityContext";
import { FontSwitch } from "./FontSwitch";
import { cx } from "../../lib/utils";

export function AccessibilityToolbar() {
  const [ouvert, setOuvert] = useState(false);
  const { tailleTexte, setTailleTexte, animationsActivees, toggleAnimations, sonActive, toggleSon } =
    useAccessibility();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
        aria-controls="panneau-accessibilite"
        aria-label="Ouvrir les réglages d'accessibilité"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-ivoire-soft text-lg"
      >
        ⚙️
      </button>
      {ouvert && (
        <div
          id="panneau-accessibilite"
          role="region"
          aria-label="Réglages d'accessibilité"
          className="absolute right-0 top-12 w-64 space-y-3 rounded-2xl border border-ivoire-soft bg-ivoire p-4 shadow-lg"
        >
          <div>
            <p className="mb-1 text-xs font-semibold text-ink/70">Police</p>
            <FontSwitch />
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold text-ink/70">Taille du texte</p>
            <div role="group" aria-label="Taille du texte" className="flex gap-1">
              {(["normale", "grande", "tres-grande"] as const).map((taille) => (
                <button
                  key={taille}
                  type="button"
                  onClick={() => setTailleTexte(taille)}
                  aria-pressed={tailleTexte === taille}
                  className={cx(
                    "rounded-lg px-2 py-1 text-xs font-medium",
                    tailleTexte === taille ? "bg-maths text-white" : "bg-ivoire-soft text-ink"
                  )}
                >
                  {taille === "normale" ? "A" : taille === "grande" ? "A+" : "A++"}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between text-sm">
            Animations
            <input
              type="checkbox"
              checked={animationsActivees}
              onChange={toggleAnimations}
              aria-label="Activer ou désactiver les animations"
            />
          </label>

          <label className="flex items-center justify-between text-sm">
            Son
            <input
              type="checkbox"
              checked={sonActive}
              onChange={toggleSon}
              aria-label="Activer ou désactiver le son"
            />
          </label>
        </div>
      )}
    </div>
  );
}

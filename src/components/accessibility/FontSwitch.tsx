import { useAccessibility } from "../../context/AccessibilityContext";
import { cx } from "../../lib/utils";

export function FontSwitch() {
  const { police, setPolice } = useAccessibility();

  return (
    <div role="group" aria-label="Choix de la police de texte" className="flex gap-1">
      <button
        type="button"
        onClick={() => setPolice("lisible")}
        aria-pressed={police === "lisible"}
        className={cx(
          "rounded-lg px-2 py-1 text-xs font-medium",
          police === "lisible" ? "bg-maths text-white" : "bg-ivoire-soft text-ink"
        )}
      >
        Police standard
      </button>
      <button
        type="button"
        onClick={() => setPolice("dys")}
        aria-pressed={police === "dys"}
        className={cx(
          "rounded-lg px-2 py-1 text-xs font-medium",
          police === "dys" ? "bg-maths text-white" : "bg-ivoire-soft text-ink"
        )}
      >
        Police DYS
      </button>
    </div>
  );
}

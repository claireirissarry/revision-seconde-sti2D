import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Police = "lisible" | "dys";
type TailleTexte = "normale" | "grande" | "tres-grande";

interface AccessibilitePrefs {
  police: Police;
  tailleTexte: TailleTexte;
  animationsActivees: boolean;
  sonActive: boolean;
}

interface AccessibilityContextValue extends AccessibilitePrefs {
  setPolice: (p: Police) => void;
  setTailleTexte: (t: TailleTexte) => void;
  toggleAnimations: () => void;
  toggleSon: () => void;
}

const STOCKAGE_CLE = "panthéon-accessibilite";

const valeursParDefaut: AccessibilitePrefs = {
  police: "lisible",
  tailleTexte: "normale",
  animationsActivees: true,
  sonActive: true,
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function chargerPrefs(): AccessibilitePrefs {
  if (typeof window === "undefined") return valeursParDefaut;
  try {
    const brut = window.localStorage.getItem(STOCKAGE_CLE);
    if (!brut) return valeursParDefaut;
    return { ...valeursParDefaut, ...JSON.parse(brut) };
  } catch {
    return valeursParDefaut;
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilitePrefs>(chargerPrefs);

  useEffect(() => {
    window.localStorage.setItem(STOCKAGE_CLE, JSON.stringify(prefs));

    const racine = document.documentElement;
    racine.dataset.police = prefs.police;
    racine.dataset.taille = prefs.tailleTexte;
    racine.dataset.animations = prefs.animationsActivees ? "on" : "off";
  }, [prefs]);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      ...prefs,
      setPolice: (police) => setPrefs((p) => ({ ...p, police })),
      setTailleTexte: (tailleTexte) => setPrefs((p) => ({ ...p, tailleTexte })),
      toggleAnimations: () =>
        setPrefs((p) => ({ ...p, animationsActivees: !p.animationsActivees })),
      toggleSon: () => setPrefs((p) => ({ ...p, sonActive: !p.sonActive })),
    }),
    [prefs]
  );

  return (
    <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility doit être utilisé dans AccessibilityProvider");
  return ctx;
}

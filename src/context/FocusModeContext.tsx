import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type DureeSessionMin = 5 | 10 | 15;

interface FocusModeContextValue {
  focusActif: boolean;
  dureeChoisieMin: DureeSessionMin;
  demarrerFocus: (duree: DureeSessionMin) => void;
  arreterFocus: () => void;
}

const FocusModeContext = createContext<FocusModeContextValue | null>(null);

export function FocusModeProvider({ children }: { children: ReactNode }) {
  const [focusActif, setFocusActif] = useState(false);
  const [dureeChoisieMin, setDureeChoisieMin] = useState<DureeSessionMin>(10);

  const value = useMemo<FocusModeContextValue>(
    () => ({
      focusActif,
      dureeChoisieMin,
      demarrerFocus: (duree) => {
        setDureeChoisieMin(duree);
        setFocusActif(true);
      },
      arreterFocus: () => setFocusActif(false),
    }),
    [focusActif, dureeChoisieMin]
  );

  return <FocusModeContext.Provider value={value}>{children}</FocusModeContext.Provider>;
}

export function useFocusMode(): FocusModeContextValue {
  const ctx = useContext(FocusModeContext);
  if (!ctx) throw new Error("useFocusMode doit être utilisé dans FocusModeProvider");
  return ctx;
}

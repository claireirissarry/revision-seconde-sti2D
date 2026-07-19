import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";

interface AmbianceAudioContextValue {
  musiqueActive: boolean;
  toggleMusique: () => void;
}

const AmbianceAudioContext = createContext<AmbianceAudioContextValue | null>(null);

const MUSIQUE_URL = "/audio/ambiance-douce.mp3";

export function AmbianceAudioProvider({ children }: { children: ReactNode }) {
  const [musiqueActive, setMusiqueActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const value = useMemo<AmbianceAudioContextValue>(
    () => ({
      musiqueActive,
      toggleMusique: () => {
        if (!audioRef.current) {
          audioRef.current = new Audio(MUSIQUE_URL);
          audioRef.current.loop = true;
          audioRef.current.volume = 0.25;
        }
        if (musiqueActive) {
          audioRef.current.pause();
        } else {
          void audioRef.current.play().catch(() => {
            // lecture bloquée tant qu'il n'y a pas d'interaction utilisateur : sans gravité
          });
        }
        setMusiqueActive((actif) => !actif);
      },
    }),
    [musiqueActive]
  );

  return (
    <AmbianceAudioContext.Provider value={value}>{children}</AmbianceAudioContext.Provider>
  );
}

export function useAmbianceAudio(): AmbianceAudioContextValue {
  const ctx = useContext(AmbianceAudioContext);
  if (!ctx) throw new Error("useAmbianceAudio doit être utilisé dans AmbianceAudioProvider");
  return ctx;
}

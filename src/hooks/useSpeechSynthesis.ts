import { useCallback, useEffect, useRef, useState } from "react";
import {
  arreterLectureVocale,
  estLectureVocaleDisponible,
  lireTexteAVoixHaute,
} from "../lib/speech";

export function useSpeechSynthesis(texte: string) {
  const [enLecture, setEnLecture] = useState(false);
  const [indexMotActif, setIndexMotActif] = useState<number | null>(null);
  const texteRef = useRef(texte);
  texteRef.current = texte;

  useEffect(() => arreterLectureVocale, [texte]);

  const demarrer = useCallback(() => {
    lireTexteAVoixHaute({
      texte: texteRef.current,
      onMot: (charIndex) => setIndexMotActif(charIndex),
      onFin: () => {
        setEnLecture(false);
        setIndexMotActif(null);
      },
    });
    setEnLecture(true);
  }, []);

  const arreter = useCallback(() => {
    arreterLectureVocale();
    setEnLecture(false);
    setIndexMotActif(null);
  }, []);

  const basculer = useCallback(() => {
    if (enLecture) arreter();
    else demarrer();
  }, [enLecture, demarrer, arreter]);

  return {
    disponible: estLectureVocaleDisponible(),
    enLecture,
    indexMotActif,
    basculer,
  };
}

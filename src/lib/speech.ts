export interface LecteurVocalOptions {
  texte: string;
  langue?: string;
  debit?: number;
  onMot?: (charIndex: number, charLength: number) => void;
  onFin?: () => void;
}

export function estLectureVocaleDisponible(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function lireTexteAVoixHaute({
  texte,
  langue = "fr-FR",
  debit = 0.95,
  onMot,
  onFin,
}: LecteurVocalOptions): SpeechSynthesisUtterance | null {
  if (!estLectureVocaleDisponible()) return null;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(texte);
  utterance.lang = langue;
  utterance.rate = debit;

  utterance.onboundary = (event) => {
    if (event.name === "word" && onMot) {
      onMot(event.charIndex, event.charLength ?? 0);
    }
  };

  if (onFin) {
    utterance.onend = onFin;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function arreterLectureVocale(): void {
  if (estLectureVocaleDisponible()) {
    window.speechSynthesis.cancel();
  }
}

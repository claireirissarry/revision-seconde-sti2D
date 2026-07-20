export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDureeMin(min: number): string {
  return `${min} min`;
}

export function aujourdhuiISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface MotPositionne {
  texte: string;
  debut: number;
  fin: number;
}

export function melangerChoix(
  choix: string[],
  bonneReponseIndex: number
): { choix: string[]; bonneReponseIndex: number } {
  const indices = choix.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    choix: indices.map((i) => choix[i]),
    bonneReponseIndex: indices.indexOf(bonneReponseIndex),
  };
}

export function decouperEnMots(texte: string): MotPositionne[] {
  const mots: MotPositionne[] = [];
  const regex = /\S+/g;
  let correspondance: RegExpExecArray | null;
  while ((correspondance = regex.exec(texte)) !== null) {
    mots.push({
      texte: correspondance[0],
      debut: correspondance.index,
      fin: correspondance.index + correspondance[0].length,
    });
  }
  return mots;
}

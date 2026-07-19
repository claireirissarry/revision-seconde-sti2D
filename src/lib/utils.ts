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

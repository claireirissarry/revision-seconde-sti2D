import { decouperEnMots, cx } from "../../lib/utils";

interface Props {
  texte: string;
  indexMotActif: number | null;
}

export function TexteAvecSurlignage({ texte, indexMotActif }: Props) {
  const mots = decouperEnMots(texte);

  return (
    <p>
      {mots.map((mot, i) => {
        const actif = indexMotActif !== null && indexMotActif >= mot.debut && indexMotActif < mot.fin;
        return (
          <span key={i} className={cx(actif && "mot-en-cours-lecture")}>
            {mot.texte}
            {i < mots.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

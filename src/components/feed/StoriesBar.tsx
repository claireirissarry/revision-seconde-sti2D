import { Link } from "react-router-dom";
import type { Chapitre, StatutMaitrise } from "../../types/content";
import { cx } from "../../lib/utils";

interface Props {
  chapitres: Chapitre[];
  statutParChapitre: Record<string, StatutMaitrise | undefined>;
}

const COULEUR_ANNEAU: Record<StatutMaitrise, string> = {
  decouverte: "ring-ivoire-soft",
  en_cours: "ring-arcenciel-miel",
  maitrise: "ring-transparent",
};

export function StoriesBar({ chapitres, statutParChapitre }: Props) {
  return (
    <ul
      aria-label="Chapitres du jour"
      className="flex gap-3 overflow-x-auto pb-2"
    >
      {chapitres.map((chapitre) => {
        const statut = statutParChapitre[chapitre.id] ?? "decouverte";
        const maitrise = statut === "maitrise";
        return (
          <li key={chapitre.id} className="flex shrink-0 flex-col items-center gap-1">
            <Link
              to={`/chapitre/${chapitre.id}`}
              className={cx(
                "flex h-16 w-16 items-center justify-center rounded-full text-2xl ring-2 ring-offset-2",
                maitrise ? "bg-degrade-arcenciel" : "bg-ivoire-soft",
                COULEUR_ANNEAU[statut]
              )}
              aria-label={`${chapitre.titre} — ${statut === "maitrise" ? "maîtrisé" : statut === "en_cours" ? "en cours" : "à découvrir"}`}
            >
              <span aria-hidden="true">{chapitre.matiere === "maths" ? "🗡️" : "🚀"}</span>
            </Link>
            <p className="w-16 truncate text-center text-xs">{chapitre.titre}</p>
          </li>
        );
      })}
    </ul>
  );
}

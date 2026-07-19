import type { Badge } from "../../types/content";
import { cx } from "../../lib/utils";

interface Props {
  badges: Badge[];
  idsDebloques: Set<string>;
}

export function BadgeGrid({ badges, idsDebloques }: Props) {
  return (
    <ul className="grid grid-cols-3 gap-3" aria-label="Galerie du Panthéon">
      {badges.map((badge) => {
        const debloque = idsDebloques.has(badge.id);
        return (
          <li key={badge.id} className="flex flex-col items-center gap-1 text-center">
            <div
              className={cx(
                "flex h-16 w-16 items-center justify-center rounded-full text-2xl",
                debloque ? "bg-degrade-arcenciel" : "bg-ivoire-soft grayscale opacity-50"
              )}
              role="img"
              aria-label={debloque ? badge.titre : `Portrait verrouillé : ${badge.titre}`}
            >
              <span aria-hidden="true">{badge.icone}</span>
            </div>
            <p className="text-xs font-medium">{debloque ? badge.titre : "?"}</p>
          </li>
        );
      })}
    </ul>
  );
}

import { useBadges } from "../hooks/useBadges";
import { BadgeGrid } from "../components/badges/BadgeGrid";
import badgesData from "../data/badges.json";
import type { Badge } from "../types/content";

const badges = badgesData as Badge[];

export default function BadgesPage() {
  const { idsDebloques } = useBadges();

  return (
    <div className="space-y-5">
      <h1 className="font-titre text-2xl font-bold">Le Panthéon des Bâtisseuses</h1>
      <p className="text-sm text-ink/70">
        Chaque chapitre maîtrisé dévoile le portrait d'une femme forte. Continue pour reconstruire
        la galerie en entier.
      </p>
      <BadgeGrid badges={badges} idsDebloques={idsDebloques} />

      <ul className="space-y-2">
        {badges
          .filter((b) => idsDebloques.has(b.id))
          .map((b) => (
            <li key={b.id} className="rounded-xl bg-ivoire-soft p-3 text-sm">
              <span aria-hidden="true">{b.icone}</span> <strong>{b.titre}</strong> — {b.description}
            </li>
          ))}
      </ul>
    </div>
  );
}

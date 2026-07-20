import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Mascotte, Badge, StatutMaitrise } from "../types/content";
import { useChapitres } from "../hooks/useChapitres";
import { useProgression } from "../hooks/useProgression";
import { useBadges } from "../hooks/useBadges";
import { calculerBadgesDebloques } from "../lib/badges";
import { NotionCard } from "../components/notion/NotionCard";
import { Quiz } from "../components/quiz/Quiz";
import { BadgeUnlockModal } from "../components/badges/BadgeUnlockModal";
import mascottesData from "../data/mascottes.json";
import badgesData from "../data/badges.json";

const mascottes = mascottesData as Mascotte[];
const badges = badgesData as Badge[];

export default function ChapitreDetail() {
  const { id } = useParams<{ id: string }>();
  const { chapitres } = useChapitres();
  const { progression, enregistrerProgression } = useProgression();
  const { idsDebloques, debloquerBadge } = useBadges();
  const [fileBadges, setFileBadges] = useState<Badge[]>([]);

  const chapitre = chapitres.find((c) => c.id === id);

  if (!chapitre) {
    return (
      <div className="space-y-3">
        <p>Ce chapitre n'existe pas encore.</p>
        <Link to="/" className="text-maths underline">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const mascotte = mascottes.find((m) => m.id === chapitre.mascotteId);

  async function surQuizTermine(score: number, total: number) {
    const statut: StatutMaitrise = score === total ? "maitrise" : score > 0 ? "en_cours" : "decouverte";
    await enregistrerProgression(chapitre!.id, statut, score);

    const nouveauxBadges = calculerBadgesDebloques(chapitre!.id, statut, progression, badges, idsDebloques);
    for (const badge of nouveauxBadges) {
      await debloquerBadge(badge.id);
    }
    if (nouveauxBadges.length > 0) setFileBadges(nouveauxBadges);
  }

  return (
    <div className="space-y-6">
      <NotionCard chapitre={chapitre} />
      {mascotte && <Quiz chapitreId={chapitre.id} mascotte={mascotte} onTermine={surQuizTermine} />}
      <BadgeUnlockModal
        badge={fileBadges[0] ?? null}
        onFermer={() => setFileBadges((prec) => prec.slice(1))}
      />
    </div>
  );
}

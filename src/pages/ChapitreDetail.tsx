import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Mascotte, Badge } from "../types/content";
import { useChapitres } from "../hooks/useChapitres";
import { useProgression } from "../hooks/useProgression";
import { useBadges } from "../hooks/useBadges";
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
  const { enregistrerProgression } = useProgression();
  const { debloquerBadge } = useBadges();
  const [badgeAAfficher, setBadgeAAfficher] = useState<Badge | null>(null);

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
    const statut = score === total ? "maitrise" : score > 0 ? "en_cours" : "decouverte";
    await enregistrerProgression(chapitre!.id, statut, score);

    if (statut === "maitrise") {
      const badgeAssocie = badges.find((b) => b.condition === `chapitre:${chapitre!.id}:maitrise`);
      if (badgeAssocie) {
        const vientDEtreDebloque = await debloquerBadge(badgeAssocie.id);
        if (vientDEtreDebloque) setBadgeAAfficher(badgeAssocie);
      }
    }
  }

  return (
    <div className="space-y-6">
      <NotionCard chapitre={chapitre} />
      {mascotte && <Quiz chapitreId={chapitre.id} mascotte={mascotte} onTermine={surQuizTermine} />}
      <BadgeUnlockModal badge={badgeAAfficher} onFermer={() => setBadgeAAfficher(null)} />
    </div>
  );
}

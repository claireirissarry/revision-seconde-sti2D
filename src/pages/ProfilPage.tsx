import { useAuth } from "../context/AuthContext";
import { useStreak } from "../hooks/useStreak";
import { useProgression } from "../hooks/useProgression";
import { useChapitres } from "../hooks/useChapitres";
import { useBadges } from "../hooks/useBadges";
import { BadgeGrid } from "../components/badges/BadgeGrid";
import badgesData from "../data/badges.json";
import type { Badge } from "../types/content";

const badges = badgesData as Badge[];

export default function ProfilPage() {
  const { session, deconnexion } = useAuth();
  const { streak } = useStreak();
  const { progression } = useProgression();
  const { chapitres } = useChapitres();
  const { idsDebloques } = useBadges();

  const nbMaitrises = Object.values(progression).filter((p) => p.statut === "maitrise").length;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-degrade-arcenciel text-2xl">
          👤
        </div>
        <div>
          <p className="font-titre text-lg font-bold">{session?.user.email ?? "Élève invitée"}</p>
          <p className="text-sm text-ink/70">
            🔥 {streak.joursConsecutifs} jour{streak.joursConsecutifs > 1 ? "s" : ""} de suite
            {streak.boucliersRestants > 0 && ` · 🛡️ ${streak.boucliersRestants} bouclier(s)`}
          </p>
        </div>
      </header>

      <section aria-label="Statistiques de progression" className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-ivoire-soft p-4 text-center">
          <p className="font-titre text-2xl font-bold">{nbMaitrises}</p>
          <p className="text-xs text-ink/70">chapitres maîtrisés</p>
        </div>
        <div className="rounded-2xl bg-ivoire-soft p-4 text-center">
          <p className="font-titre text-2xl font-bold">{chapitres.length}</p>
          <p className="text-xs text-ink/70">chapitres disponibles</p>
        </div>
      </section>

      <section aria-label="Galerie du Panthéon">
        <h2 className="mb-2 font-titre text-lg font-bold">Ta galerie</h2>
        <BadgeGrid badges={badges} idsDebloques={idsDebloques} />
      </section>

      {session && (
        <button
          type="button"
          onClick={() => void deconnexion()}
          className="min-h-11 w-full rounded-xl bg-ivoire-soft px-4 py-3 text-sm font-medium"
        >
          Se déconnecter
        </button>
      )}
    </div>
  );
}

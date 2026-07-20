import type { Badge, ProgressionEleve, StatutMaitrise } from "../types/content";

/** Détermine les badges à débloquer suite à la maîtrise d'un chapitre : le badge propre au
 * chapitre (s'il existe) et les badges de palier "chapitres_maitrises:N" atteints. */
export function calculerBadgesDebloques(
  chapitreId: string,
  statut: StatutMaitrise,
  progression: Record<string, ProgressionEleve>,
  badges: Badge[],
  dejaDebloques: Set<string>
): Badge[] {
  if (statut !== "maitrise") return [];

  const nouveaux: Badge[] = [];

  const badgeChapitre = badges.find((b) => b.condition === `chapitre:${chapitreId}:maitrise`);
  if (badgeChapitre && !dejaDebloques.has(badgeChapitre.id)) {
    nouveaux.push(badgeChapitre);
  }

  const chapitresMaitrises = new Set(
    Object.values(progression)
      .filter((p) => p.statut === "maitrise")
      .map((p) => p.chapitreId)
  );
  chapitresMaitrises.add(chapitreId);

  for (const badge of badges) {
    const correspondance = badge.condition.match(/^chapitres_maitrises:(\d+)$/);
    if (
      correspondance &&
      !dejaDebloques.has(badge.id) &&
      chapitresMaitrises.size >= Number(correspondance[1])
    ) {
      nouveaux.push(badge);
    }
  }

  return nouveaux;
}

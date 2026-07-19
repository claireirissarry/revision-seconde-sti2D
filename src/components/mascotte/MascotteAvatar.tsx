import type { Mascotte } from "../../types/content";
import { cx } from "../../lib/utils";

const AVATARS: Record<string, string> = {
  maths: "🗡️",
  "physique-chimie": "🚀",
  transverse: "⭐",
};

export function MascotteAvatar({
  mascotte,
  taille = "md",
}: {
  mascotte: Mascotte;
  taille?: "sm" | "md" | "lg";
}) {
  const tailles = { sm: "h-8 w-8 text-base", md: "h-12 w-12 text-xl", lg: "h-20 w-20 text-3xl" };

  return (
    <div
      role="img"
      aria-label={`${mascotte.prenom}, ${mascotte.role}`}
      className={cx(
        "flex shrink-0 items-center justify-center rounded-full bg-degrade-arcenciel",
        tailles[taille]
      )}
    >
      <span aria-hidden="true">{AVATARS[mascotte.universId] ?? "⭐"}</span>
    </div>
  );
}

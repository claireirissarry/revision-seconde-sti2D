import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Mascotte } from "../../types/content";
import type { ContexteCitation } from "../../types/content";
import { MascotteAvatar } from "./MascotteAvatar";
import { useAccessibility } from "../../context/AccessibilityContext";
import citations from "../../data/citations.json";

interface Props {
  mascotte: Mascotte;
  contexte: ContexteCitation;
  avecCitation?: boolean;
}

function piocher<T>(liste: T[]): T {
  return liste[Math.floor(Math.random() * liste.length)];
}

const CLE_MESSAGE: Record<ContexteCitation, keyof Mascotte["messages"]> = {
  reussite: "reussite",
  "encouragement-echec": "echec",
  bienvenue: "bienvenue",
};

export function MascotteMessage({ mascotte, contexte, avecCitation = true }: Props) {
  const { animationsActivees } = useAccessibility();

  const message = useMemo(
    () => piocher(mascotte.messages[CLE_MESSAGE[contexte]]),
    [mascotte, contexte]
  );
  const citation = useMemo(() => {
    if (!avecCitation) return null;
    const candidates = (citations as { id: string; texte: string; contexte: ContexteCitation }[]).filter(
      (c) => c.contexte === contexte
    );
    return candidates.length ? piocher(candidates) : null;
  }, [contexte, avecCitation]);

  return (
    <motion.div
      initial={animationsActivees ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="status"
      className="flex items-start gap-3 rounded-2xl bg-ivoire-soft p-4"
    >
      <MascotteAvatar mascotte={mascotte} />
      <div className="space-y-1">
        <p className="font-medium">{message}</p>
        {citation && <p className="text-sm italic text-ink/70">« {citation.texte} »</p>}
      </div>
    </motion.div>
  );
}

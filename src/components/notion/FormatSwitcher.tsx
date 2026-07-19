import { useState } from "react";
import { cx } from "../../lib/utils";

export type Format = "texte" | "audio" | "video" | "schema";

const onglets: { id: Format; label: string; icone: string }[] = [
  { id: "texte", label: "Texte", icone: "📝" },
  { id: "audio", label: "Audio", icone: "🔊" },
  { id: "video", label: "Vidéo", icone: "🎬" },
  { id: "schema", label: "Schéma", icone: "🖼️" },
];

interface Props {
  formatActif: Format;
  onChangerFormat: (format: Format) => void;
}

export function FormatSwitcher({ formatActif, onChangerFormat }: Props) {
  return (
    <div role="tablist" aria-label="Choisir le format de la notion" className="flex gap-1 rounded-2xl bg-ivoire-soft p-1">
      {onglets.map((onglet) => (
        <button
          key={onglet.id}
          role="tab"
          type="button"
          aria-selected={formatActif === onglet.id}
          onClick={() => onChangerFormat(onglet.id)}
          className={cx(
            "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-xs font-medium transition-colors",
            formatActif === onglet.id ? "bg-maths text-white" : "text-ink/70"
          )}
        >
          <span aria-hidden="true" className="text-base">
            {onglet.icone}
          </span>
          {onglet.label}
        </button>
      ))}
    </div>
  );
}

export function useFormatSwitcher(formatInitial: Format = "texte") {
  return useState<Format>(formatInitial);
}

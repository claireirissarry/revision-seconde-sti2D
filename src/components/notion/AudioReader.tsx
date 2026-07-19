import type { BlocTexte } from "../../types/content";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import { TexteAvecSurlignage } from "./TexteAvecSurlignage";

export function AudioReader({ blocs }: { blocs: BlocTexte[] }) {
  const texteComplet = blocs.map((b) => b.texte).join(" ");
  const { disponible, enLecture, indexMotActif, basculer } = useSpeechSynthesis(texteComplet);

  if (!disponible) {
    return (
      <p className="rounded-xl bg-ivoire-soft p-4 text-sm">
        La lecture audio n'est pas disponible sur ce navigateur. Essaie le format texte ou vidéo.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={basculer}
        aria-pressed={enLecture}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-physique text-2xl text-white shadow-md"
        aria-label={enLecture ? "Mettre la lecture en pause" : "Écouter le chapitre en entier"}
      >
        {enLecture ? "⏸" : "▶️"}
      </button>
      <div className="rounded-xl bg-ivoire-soft p-4">
        <TexteAvecSurlignage texte={texteComplet} indexMotActif={enLecture ? indexMotActif : null} />
      </div>
    </div>
  );
}

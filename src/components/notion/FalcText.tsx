import type { BlocTexte } from "../../types/content";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import { TexteAvecSurlignage } from "./TexteAvecSurlignage";

function BlocFalc({ bloc }: { bloc: BlocTexte }) {
  const { disponible, enLecture, indexMotActif, basculer } = useSpeechSynthesis(bloc.texte);

  return (
    <li className="flex items-start gap-3 rounded-xl bg-ivoire-soft p-3">
      <TexteAvecSurlignage texte={bloc.texte} indexMotActif={enLecture ? indexMotActif : null} />
      {disponible && (
        <button
          type="button"
          onClick={basculer}
          aria-label={enLecture ? "Arrêter la lecture de cette phrase" : "Écouter cette phrase"}
          aria-pressed={enLecture}
          className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maths-light text-maths-dark"
        >
          {enLecture ? "⏸" : "🔊"}
        </button>
      )}
    </li>
  );
}

export function FalcText({ blocs }: { blocs: BlocTexte[] }) {
  return (
    <ul className="space-y-2" aria-label="Texte facile à lire et à comprendre">
      {blocs.map((bloc) => (
        <BlocFalc key={bloc.id} bloc={bloc} />
      ))}
    </ul>
  );
}

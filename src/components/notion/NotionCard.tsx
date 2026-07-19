import type { Chapitre } from "../../types/content";
import { FormatSwitcher, useFormatSwitcher } from "./FormatSwitcher";
import { FalcText } from "./FalcText";
import { AudioReader } from "./AudioReader";
import { VideoEmbed } from "./VideoEmbed";
import { SchemaViewer } from "./SchemaViewer";
import { cx } from "../../lib/utils";

export function NotionCard({ chapitre }: { chapitre: Chapitre }) {
  const [format, setFormat] = useFormatSwitcher("texte");
  const couleurMatiere = chapitre.matiere === "maths" ? "maths" : "physique";

  return (
    <section
      aria-labelledby={`titre-${chapitre.id}`}
      className={cx(
        "space-y-4 rounded-3xl border-2 p-4",
        couleurMatiere === "maths" ? "border-maths-light" : "border-physique-light"
      )}
    >
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/60">
          {chapitre.theme}
        </p>
        <h2 id={`titre-${chapitre.id}`} className="font-titre text-xl font-bold">
          {chapitre.titre}
        </h2>
        {chapitre.essentielSTI2D && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-degrade-arcenciel px-3 py-1 text-xs font-semibold text-white"
            title={chapitre.justificationSTI2D}
          >
            Essentiel pour la 1ère STI2D 🔧
          </span>
        )}
        {chapitre.justificationSTI2D && (
          <p className="text-xs text-ink/70">{chapitre.justificationSTI2D}</p>
        )}
      </header>

      <FormatSwitcher formatActif={format} onChangerFormat={setFormat} />

      <div>
        {format === "texte" && <FalcText blocs={chapitre.formats.texte.blocs} />}
        {format === "audio" && <AudioReader blocs={chapitre.formats.texte.blocs} />}
        {format === "video" && <VideoEmbed video={chapitre.formats.video} />}
        {format === "schema" && <SchemaViewer schema={chapitre.formats.schema} />}
      </div>
    </section>
  );
}

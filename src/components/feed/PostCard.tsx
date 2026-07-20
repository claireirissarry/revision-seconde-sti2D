import { useState } from "react";
import { Link } from "react-router-dom";
import type { Chapitre, Mascotte } from "../../types/content";
import { MascotteAvatar } from "../mascotte/MascotteAvatar";
import { cx } from "../../lib/utils";

export function PostCard({ chapitre, mascotte }: { chapitre: Chapitre; mascotte: Mascotte }) {
  const [aime, setAime] = useState(false);
  const premierBloc = chapitre.formats.texte.blocs[0]?.texte ?? "";

  return (
    <article className="space-y-3 rounded-3xl bg-white/60 p-4" aria-label={`Publication : ${chapitre.titre}`}>
      <header className="flex items-center gap-2">
        <MascotteAvatar mascotte={mascotte} taille="sm" />
        <div>
          <p className="text-sm font-semibold">{mascotte.prenom}</p>
          <p className="text-xs text-ink/60">{chapitre.theme}</p>
        </div>
        {chapitre.essentielSTI2D && (
          <span className="ml-auto rounded-full bg-degrade-arcenciel px-2 py-0.5 text-[0.65rem] font-semibold text-white">
            STI2D 🔧
          </span>
        )}
      </header>

      <Link to={`/chapitre/${chapitre.id}`} className="block space-y-1">
        <h3 className="font-titre text-lg font-bold">{chapitre.titre}</h3>
        <p className="text-sm text-ink/80">{premierBloc}</p>
      </Link>

      <footer className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setAime((v) => !v)}
          aria-pressed={aime}
          aria-label={aime ? "Retirer le j'aime" : "Aimer cette publication"}
          className={cx("flex min-h-11 items-center gap-1 rounded-full px-3 py-2 text-sm", aime ? "bg-arcenciel-corail/20" : "bg-ivoire-soft")}
        >
          <span aria-hidden="true">{aime ? "❤️" : "🤍"}</span> J'aime
        </button>
      </footer>
    </article>
  );
}

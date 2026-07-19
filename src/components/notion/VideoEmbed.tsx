import type { FormatVideo } from "../../types/content";

function versUrlEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    return null;
  } catch {
    return null;
  }
}

export function VideoEmbed({ video }: { video: FormatVideo }) {
  const urlEmbed = video.url ? versUrlEmbed(video.url) : null;

  if (!urlEmbed) {
    return (
      <p className="rounded-xl bg-ivoire-soft p-4 text-sm">
        Vidéo bientôt disponible pour « {video.titre} ». En attendant, essaie le format texte,
        audio ou schéma.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="aspect-video overflow-hidden rounded-xl">
        <iframe
          className="h-full w-full"
          src={urlEmbed}
          title={video.titre}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="text-xs text-ink/70">
        {video.titre} — environ {video.dureeMin} min
      </p>
    </div>
  );
}

import type { Chapitre, Mascotte } from "../../types/content";
import { PostCard } from "./PostCard";
import { useProgression } from "../../hooks/useProgression";
import mascottesData from "../../data/mascottes.json";

const mascottes = mascottesData as Mascotte[];

export function Feed({ chapitres }: { chapitres: Chapitre[] }) {
  const { progression } = useProgression();

  return (
    <div className="space-y-4">
      {chapitres.map((chapitre) => {
        const mascotte = mascottes.find((m) => m.id === chapitre.mascotteId);
        if (!mascotte) return null;
        return (
          <PostCard
            key={chapitre.id}
            chapitre={chapitre}
            mascotte={mascotte}
            pourcentage={progression[chapitre.id]?.score ?? null}
          />
        );
      })}
    </div>
  );
}

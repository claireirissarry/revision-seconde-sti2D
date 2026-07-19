import type { Chapitre, Mascotte } from "../../types/content";
import { PostCard } from "./PostCard";
import mascottesData from "../../data/mascottes.json";

const mascottes = mascottesData as Mascotte[];

export function Feed({ chapitres }: { chapitres: Chapitre[] }) {
  return (
    <div className="space-y-4">
      {chapitres.map((chapitre) => {
        const mascotte = mascottes.find((m) => m.id === chapitre.mascotteId);
        if (!mascotte) return null;
        return <PostCard key={chapitre.id} chapitre={chapitre} mascotte={mascotte} />;
      })}
    </div>
  );
}

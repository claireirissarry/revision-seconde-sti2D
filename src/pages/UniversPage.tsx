import type { Matiere, Mascotte } from "../types/content";
import { useChapitres } from "../hooks/useChapitres";
import { MascotteMessage } from "../components/mascotte/MascotteMessage";
import { Feed } from "../components/feed/Feed";
import mascottesData from "../data/mascottes.json";

const mascottes = mascottesData as Mascotte[];

interface Props {
  matiere: Matiere;
  nomUnivers: string;
  mascotteId: string;
}

export function UniversPage({ matiere, nomUnivers, mascotteId }: Props) {
  const { chapitres } = useChapitres(matiere);
  const mascotte = mascottes.find((m) => m.id === mascotteId);

  return (
    <div className="space-y-5">
      <h1 className="font-titre text-2xl font-bold">{nomUnivers}</h1>
      {mascotte && <MascotteMessage mascotte={mascotte} contexte="bienvenue" avecCitation={false} />}
      <Feed chapitres={chapitres} />
    </div>
  );
}

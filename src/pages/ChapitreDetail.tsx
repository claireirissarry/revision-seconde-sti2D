import { useParams, Link } from "react-router-dom";
import type { Mascotte } from "../types/content";
import { useChapitres } from "../hooks/useChapitres";
import { ParcoursChapitre } from "../components/chapitre/ParcoursChapitre";
import mascottesData from "../data/mascottes.json";

const mascottes = mascottesData as Mascotte[];

export default function ChapitreDetail() {
  const { id } = useParams<{ id: string }>();
  const { chapitres } = useChapitres();

  const chapitre = chapitres.find((c) => c.id === id);

  if (!chapitre) {
    return (
      <div className="space-y-3">
        <p>Ce chapitre n'existe pas encore.</p>
        <Link to="/" className="text-maths underline">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const mascotte = mascottes.find((m) => m.id === chapitre.mascotteId);
  if (!mascotte) return null;

  return <ParcoursChapitre chapitre={chapitre} mascotte={mascotte} />;
}

import { useChapitres } from "../hooks/useChapitres";
import { useProgression } from "../hooks/useProgression";
import { StoriesBar } from "../components/feed/StoriesBar";
import { Feed } from "../components/feed/Feed";

export default function HomeFeed() {
  const { chapitres } = useChapitres();
  const { progression } = useProgression();

  const statutParChapitre = Object.fromEntries(
    Object.values(progression).map((p) => [p.chapitreId, p.statut])
  );

  return (
    <div className="space-y-5">
      <StoriesBar chapitres={chapitres} statutParChapitre={statutParChapitre} />
      <Feed chapitres={chapitres} />
    </div>
  );
}

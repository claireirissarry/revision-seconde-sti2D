import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="space-y-3 text-center">
      <p className="text-4xl" aria-hidden="true">
        🧭
      </p>
      <h1 className="font-titre text-xl font-bold">Cette page s'est perdue en chemin</h1>
      <Link to="/" className="text-maths underline">
        Retour à l'accueil
      </Link>
    </div>
  );
}

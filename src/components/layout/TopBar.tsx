import { Link } from "react-router-dom";
import { AccessibilityToolbar } from "../accessibility/AccessibilityToolbar";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ivoire-soft bg-ivoire/95 px-4 py-3 backdrop-blur">
      <Link
        to="/"
        className="font-titre text-lg font-bold text-ink"
        aria-label="Retour à l'accueil, Le Panthéon des Bâtisseuses"
      >
        ✨ Le Panthéon des Bâtisseuses
      </Link>
      <AccessibilityToolbar />
    </header>
  );
}

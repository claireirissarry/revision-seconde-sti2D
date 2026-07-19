import { NavLink } from "react-router-dom";
import { cx } from "../../lib/utils";

const liens = [
  { to: "/", label: "Accueil", icone: "🏠" },
  { to: "/univers/maths", label: "Maths", icone: "🗺️" },
  { to: "/univers/physique-chimie", label: "Physique-Chimie", icone: "🔭" },
  { to: "/badges", label: "Panthéon", icone: "🖼️" },
  { to: "/profil", label: "Profil", icone: "👤" },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Navigation principale"
      className="sticky bottom-0 z-20 flex justify-around border-t border-ivoire-soft bg-ivoire/95 py-1 backdrop-blur"
    >
      {liens.map((lien) => (
        <NavLink
          key={lien.to}
          to={lien.to}
          end={lien.to === "/"}
          className={({ isActive }) =>
            cx(
              "flex min-w-[4.5rem] flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium",
              isActive ? "bg-maths-light text-maths-dark" : "text-ink/70"
            )
          }
        >
          <span aria-hidden="true" className="text-xl">
            {lien.icone}
          </span>
          {lien.label}
        </NavLink>
      ))}
    </nav>
  );
}

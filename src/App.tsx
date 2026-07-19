import { AppShell } from "./components/layout/AppShell";
import { AppRoutes } from "./router";

export default function App() {
  return (
    <AppShell>
      <a href="#contenu-principal" className="sr-only focus:not-sr-only">
        Aller au contenu principal
      </a>
      <AppRoutes />
    </AppShell>
  );
}

import type { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { useFocusMode } from "../../context/FocusModeContext";
import { cx } from "../../lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const { focusActif } = useFocusMode();

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
      {!focusActif && <TopBar />}
      <main
        id="contenu-principal"
        className={cx("flex-1 px-4 py-4", focusActif && "bg-ink/95")}
      >
        {children}
      </main>
      {!focusActif && <BottomNav />}
    </div>
  );
}

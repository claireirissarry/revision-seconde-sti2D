import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseConfigure } from "../lib/supabaseClient";

interface AuthContextValue {
  session: Session | null;
  chargement: boolean;
  role: "eleve" | "parent" | null;
  connexionParLien: (email: string) => Promise<{ erreur: string | null }>;
  deconnexion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [chargement, setChargement] = useState(supabaseConfigure);

  useEffect(() => {
    if (!supabaseConfigure) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChargement(false);
    });

    const { data: abonnement } = supabase.auth.onAuthStateChange((_event, nouvelleSession) => {
      setSession(nouvelleSession);
    });

    return () => abonnement.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      chargement,
      role: (session?.user.user_metadata?.role as "eleve" | "parent" | undefined) ?? null,
      connexionParLien: async (email: string) => {
        if (!supabaseConfigure) {
          return { erreur: "Supabase n'est pas encore configuré (voir .env.local)." };
        }
        const { error } = await supabase.auth.signInWithOtp({ email });
        return { erreur: error?.message ?? null };
      },
      deconnexion: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, chargement]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}

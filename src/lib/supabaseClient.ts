import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigure =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

if (!supabaseConfigure) {
  console.warn(
    "Variables Supabase manquantes : renseigne VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local. " +
      "L'application utilise en attendant le contenu local (src/data/*.json) et la progression n'est pas sauvegardée."
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

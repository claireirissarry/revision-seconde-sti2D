// Types minimaux le temps de générer les types complets avec :
// npx supabase gen types typescript --project-id <id> > src/types/database.ts
export interface Database {
  public: {
    Tables: {
      chapitres: {
        Row: {
          id: string;
          matiere: string;
          theme: string;
          titre: string;
          ordre: number;
          duree_estimee_min: number;
          badge_sti2d: boolean;
          justification_sti2d: string | null;
          resume_falc: { id: string; texte: string }[];
          video_url: string | null;
          video_titre: string | null;
          video_duree_min: number | null;
          schema_type: "svg" | "image" | null;
          schema_src: string | null;
          schema_alt: string | null;
          schema_legende_falc: string | null;
          mascotte_id: string;
        };
        Insert: Partial<Database["public"]["Tables"]["chapitres"]["Row"]> &
          Pick<Database["public"]["Tables"]["chapitres"]["Row"], "id" | "matiere" | "theme" | "titre" | "mascotte_id">;
        Update: Partial<Database["public"]["Tables"]["chapitres"]["Row"]>;
        Relationships: [];
      };
      quiz_questions: {
        Row: {
          id: string;
          chapitre_id: string;
          question: string;
          choix: string[];
          bonne_reponse: number;
          indice: string;
          explication_falc: string;
        };
        Insert: Database["public"]["Tables"]["quiz_questions"]["Row"];
        Update: Partial<Database["public"]["Tables"]["quiz_questions"]["Row"]>;
        Relationships: [];
      };
      progression_eleve: {
        Row: {
          id: string;
          user_id: string;
          chapitre_id: string;
          statut: string;
          score: number | null;
          date_derniere_revision: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["progression_eleve"]["Row"]> &
          Pick<Database["public"]["Tables"]["progression_eleve"]["Row"], "user_id" | "chapitre_id" | "statut">;
        Update: Partial<Database["public"]["Tables"]["progression_eleve"]["Row"]>;
        Relationships: [];
      };
      streaks: {
        Row: {
          id: string;
          user_id: string;
          jours_consecutifs: number;
          dernier_jour_actif: string | null;
          boucliers_restants: number;
        };
        Insert: Partial<Database["public"]["Tables"]["streaks"]["Row"]> &
          Pick<Database["public"]["Tables"]["streaks"]["Row"], "user_id">;
        Update: Partial<Database["public"]["Tables"]["streaks"]["Row"]>;
        Relationships: [];
      };
      badges_debloques: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          date_obtention: string;
        };
        Insert: Partial<Database["public"]["Tables"]["badges_debloques"]["Row"]> &
          Pick<Database["public"]["Tables"]["badges_debloques"]["Row"], "user_id" | "badge_id">;
        Update: Partial<Database["public"]["Tables"]["badges_debloques"]["Row"]>;
        Relationships: [];
      };
      liens_parent_eleve: {
        Row: {
          id: string;
          parent_user_id: string;
          eleve_user_id: string;
        };
        Insert: Partial<Database["public"]["Tables"]["liens_parent_eleve"]["Row"]> &
          Pick<Database["public"]["Tables"]["liens_parent_eleve"]["Row"], "parent_user_id" | "eleve_user_id">;
        Update: Partial<Database["public"]["Tables"]["liens_parent_eleve"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

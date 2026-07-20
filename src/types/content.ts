export type Matiere = "maths" | "physique-chimie";

export type StatutMaitrise = "decouverte" | "en_cours" | "maitrise";

export interface BlocTexte {
  id: string;
  texte: string;
}

export interface FormatVideo {
  url: string;
  titre: string;
  dureeMin: number;
}

export interface FormatSchema {
  type: "svg" | "image";
  src: string;
  alt: string;
  legendeFalc?: string;
}

export interface Chapitre {
  id: string;
  matiere: Matiere;
  theme: string;
  titre: string;
  ordre: number;
  dureeEstimeeMin: number;
  essentielSTI2D: boolean;
  justificationSTI2D?: string;
  formats: {
    texte: { blocs: BlocTexte[] };
    video: FormatVideo;
    schema: FormatSchema;
  };
  mascotteId: string;
}

export interface QuizQuestion {
  id: string;
  chapitreId: string;
  question: string;
  choix: string[];
  bonneReponseIndex: number;
  indice: string;
  explicationFalc: string;
}

export interface ExerciceQuestion {
  id: string;
  question: string;
  choix: string[];
  bonneReponseIndex: number;
  indice: string;
  explicationFalc: string;
}

export interface Exercice {
  id: string;
  chapitreId: string;
  enonce: string;
  questions: ExerciceQuestion[];
}

export type ContexteCitation = "reussite" | "encouragement-echec" | "bienvenue";

export interface Citation {
  id: string;
  texte: string;
  contexte: ContexteCitation;
}

export interface Mascotte {
  id: string;
  prenom: string;
  role: string;
  universId: Matiere | "transverse";
  description: string;
  messages: {
    reussite: string[];
    echec: string[];
    bienvenue: string[];
  };
}

export interface Badge {
  id: string;
  titre: string;
  description: string;
  icone: string;
  condition: string;
}

export interface ProgressionEleve {
  chapitreId: string;
  statut: StatutMaitrise;
  score: number | null;
  dateDerniereRevision: string | null;
}

export interface Streak {
  joursConsecutifs: number;
  dernierJourActif: string | null;
  boucliersRestants: number;
}

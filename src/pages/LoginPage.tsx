import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { connexionParLien } = useAuth();
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function surEnvoi(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    const { erreur: err } = await connexionParLien(email);
    if (err) setErreur(err);
    else setEnvoye(true);
  }

  if (envoye) {
    return (
      <p role="status" className="rounded-xl bg-ivoire-soft p-4 text-center">
        Un lien de connexion vient de t'être envoyé par e-mail. Ouvre-le pour continuer l'aventure ✨
      </p>
    );
  }

  return (
    <form onSubmit={surEnvoi} className="space-y-4">
      <h1 className="font-titre text-2xl font-bold">Se connecter</h1>
      <p className="text-sm text-ink/70">
        Entre ton e-mail, on t'envoie un lien magique. Pas de mot de passe à retenir.
      </p>
      <label className="block space-y-1">
        <span className="text-sm font-medium">Adresse e-mail</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 w-full rounded-xl border-2 border-ivoire-soft px-4 py-3"
          autoComplete="email"
        />
      </label>
      {erreur && <p className="text-sm text-arcenciel-corail">{erreur}</p>}
      <button
        type="submit"
        className="min-h-11 w-full rounded-xl bg-maths px-4 py-3 font-semibold text-white"
      >
        Recevoir mon lien magique
      </button>
    </form>
  );
}

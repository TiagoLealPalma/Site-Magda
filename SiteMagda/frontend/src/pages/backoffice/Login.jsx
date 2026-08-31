import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={location.state?.from || "/backoffice"} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
    } catch {
      setError("Utilizador ou palavra-passe incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-8">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <p className="font-display text-2xl text-gold text-center mb-1">Magda Leal</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40 text-center mb-10">
          Backoffice
        </p>

        <div className="space-y-5">
          <input
            required
            autoFocus
            type="text"
            placeholder="Utilizador"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full bg-transparent border-b border-paper/20 text-paper placeholder:text-paper/40 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
          />
          <input
            required
            type="password"
            placeholder="Palavra-passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-transparent border-b border-paper/20 text-paper placeholder:text-paper/40 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-gold text-ink text-sm tracking-wide py-3 hover:bg-gold-soft transition-colors disabled:opacity-60"
        >
          {loading ? "A entrar…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

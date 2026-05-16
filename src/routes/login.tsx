import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Admin Login — Felix Nyandiko" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/admin" });
  }, [session, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <Link to="/" className="block text-center text-xs uppercase tracking-widest text-[var(--accent-green)]">SILENT ECHO</Link>
        <h1 className="text-center text-2xl font-bold">{mode === "signup" ? "Create admin account" : "Admin sign in"}</h1>

        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-green)]"
        />
        <input
          type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 6 chars)"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-green)]"
        />

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          disabled={busy}
          className="w-full rounded-full bg-[var(--accent-green)] py-2.5 text-sm font-semibold text-black disabled:opacity-50"
        >
          {busy ? "Please wait…" : mode === "signup" ? "Sign up" : "Sign in"}
        </button>

        <button
          type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="w-full text-xs text-white/60 hover:text-white"
        >
          {mode === "signup" ? "Already have an account? Sign in" : "First time? Create your admin account"}
        </button>

        <p className="text-center text-[10px] text-white/40">
          Only felixnyandiko@gmail.com receives admin access automatically.
        </p>
      </form>
    </div>
  );
}

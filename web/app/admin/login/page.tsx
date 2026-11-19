"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Impossible de se connecter.");
        setBusy(false);
        return;
      }
      router.push(params.get("next") ?? "/admin");
      router.refresh();
    } catch {
      setError("Impossible de se connecter. Vérifiez votre connexion.");
      setBusy(false);
    }
  }

  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <h1>Administration</h1>
        <p className="sub">Ets Paradise Assistance</p>
        <form className="adm-form" onSubmit={onSubmit}>
          {error && <div className="adm-error">{error}</div>}
          <div className="adm-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="adm-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="adm-form-actions">
            <button type="submit" className="adm-btn primary" disabled={busy}>
              {busy ? "Connexion…" : "Se connecter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

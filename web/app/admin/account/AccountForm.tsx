"use client";

import { useState } from "react";

export default function AccountForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/admin/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Échec de la mise à jour.");
    } else {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setBusy(false);
  }

  return (
    <form className="adm-form" onSubmit={onSubmit}>
      {error && <div className="adm-error">{error}</div>}
      {success && <div className="adm-success">Mot de passe mis à jour.</div>}
      <div className="adm-field">
        <label htmlFor="currentPassword">Mot de passe actuel</label>
        <input
          id="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className="adm-field">
        <label htmlFor="newPassword">Nouveau mot de passe</label>
        <input
          id="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="adm-field">
        <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="adm-form-actions">
        <button type="submit" className="adm-btn primary" disabled={busy}>
          {busy ? "Mise à jour…" : "Mettre à jour le mot de passe"}
        </button>
      </div>
    </form>
  );
}

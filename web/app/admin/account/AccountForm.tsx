"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/admin/ui/Card";
import { Input, Label, FieldGroup } from "@/components/admin/ui/Field";
import Button from "@/components/admin/ui/Button";

export default function AccountForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Les deux mots de passe ne correspondent pas.");
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
      toast.error(data.error ?? "Échec de la mise à jour.");
    } else {
      toast.success("Mot de passe mis à jour.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardContent className="max-w-sm space-y-4">
          <FieldGroup>
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input
              id="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" loading={busy}>
            Mettre à jour le mot de passe
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

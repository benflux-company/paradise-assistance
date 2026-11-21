"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/admin/ui/Card";
import { Input, Textarea, Label, FieldGroup, FieldHint } from "@/components/admin/ui/Field";
import Button from "@/components/admin/ui/Button";

type Values = {
  phone: string;
  email: string;
  address: string;
  hours: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
  linkedin: string;
  budgetRanges: string[];
  projectTypes: string[];
  mapEmbed: string;
  contactEmail: string;
  seoDefaultTitle: string;
  seoDefaultDesc: string;
};

export default function SettingsForm({ initial }: { initial: Values }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [budgetText, setBudgetText] = useState(initial.budgetRanges.join("\n"));
  const [typesText, setTypesText] = useState(initial.projectTypes.join("\n"));
  const [busy, setBusy] = useState(false);

  function set<K extends keyof Values>(key: K, val: Values[K]) {
    setV((prev) => ({ ...prev, [key]: val }));
  }

  async function save() {
    setBusy(true);
    const payload = {
      ...v,
      budgetRanges: budgetText.split("\n").map((s) => s.trim()).filter(Boolean),
      projectTypes: typesText.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) toast.error("Échec de l'enregistrement.");
    else {
      toast.success("Paramètres enregistrés.");
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Coordonnées</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Label>Téléphone</Label>
            <Input value={v.phone} onChange={(e) => set("phone", e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>E-mail affiché</Label>
            <Input value={v.email} onChange={(e) => set("email", e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>Adresse</Label>
            <Input value={v.address} onChange={(e) => set("address", e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>Horaires</Label>
            <Input value={v.hours} onChange={(e) => set("hours", e.target.value)} />
          </FieldGroup>
          <FieldGroup className="sm:col-span-2">
            <Label>Carte (URL d&apos;intégration Google Maps)</Label>
            <Input value={v.mapEmbed} onChange={(e) => set("mapEmbed", e.target.value)} />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Réseaux sociaux</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Label>Facebook</Label>
            <Input value={v.facebook} onChange={(e) => set("facebook", e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>Instagram</Label>
            <Input value={v.instagram} onChange={(e) => set("instagram", e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>TikTok</Label>
            <Input value={v.tiktok} onChange={(e) => set("tiktok", e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>WhatsApp</Label>
            <Input value={v.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>LinkedIn</Label>
            <Input value={v.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formulaire de contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Label>E-mail de réception des demandes</Label>
            <Input value={v.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>Types de projet proposés</Label>
            <Textarea value={typesText} onChange={(e) => setTypesText(e.target.value)} />
            <FieldHint>Un type par ligne.</FieldHint>
          </FieldGroup>
          <FieldGroup>
            <Label>Fourchettes de budget proposées</Label>
            <Textarea value={budgetText} onChange={(e) => setBudgetText(e.target.value)} />
            <FieldHint>Une fourchette par ligne.</FieldHint>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Label>Titre par défaut</Label>
            <Input value={v.seoDefaultTitle} onChange={(e) => set("seoDefaultTitle", e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <Label>Description par défaut</Label>
            <Textarea value={v.seoDefaultDesc} onChange={(e) => set("seoDefaultDesc", e.target.value)} />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button loading={busy} onClick={save}>
            Enregistrer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

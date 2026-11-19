"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function set<K extends keyof Values>(key: K, val: Values[K]) {
    setV((prev) => ({ ...prev, [key]: val }));
  }

  async function save() {
    setBusy(true);
    setError("");
    setSaved(false);
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
    if (!res.ok) setError("Échec de l'enregistrement.");
    else {
      setSaved(true);
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <>
      <div className="adm-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "Cormorant, serif", fontWeight: 500, fontSize: 18, marginTop: 0 }}>Coordonnées</h3>
        <div className="adm-form">
          <div className="adm-field">
            <label>Téléphone</label>
            <input type="text" value={v.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>E-mail affiché</label>
            <input type="text" value={v.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Adresse</label>
            <input type="text" value={v.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Horaires</label>
            <input type="text" value={v.hours} onChange={(e) => set("hours", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Carte (URL d&apos;intégration Google Maps)</label>
            <input type="text" value={v.mapEmbed} onChange={(e) => set("mapEmbed", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="adm-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "Cormorant, serif", fontWeight: 500, fontSize: 18, marginTop: 0 }}>Réseaux sociaux</h3>
        <div className="adm-form">
          <div className="adm-field">
            <label>Facebook</label>
            <input type="text" value={v.facebook} onChange={(e) => set("facebook", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Instagram</label>
            <input type="text" value={v.instagram} onChange={(e) => set("instagram", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>TikTok</label>
            <input type="text" value={v.tiktok} onChange={(e) => set("tiktok", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>WhatsApp</label>
            <input type="text" value={v.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>LinkedIn</label>
            <input type="text" value={v.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="adm-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "Cormorant, serif", fontWeight: 500, fontSize: 18, marginTop: 0 }}>Formulaire de contact</h3>
        <div className="adm-form">
          <div className="adm-field">
            <label>E-mail de réception des demandes</label>
            <input type="text" value={v.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Types de projet proposés</label>
            <textarea value={typesText} onChange={(e) => setTypesText(e.target.value)} />
            <div className="hint">Un type par ligne.</div>
          </div>
          <div className="adm-field">
            <label>Fourchettes de budget proposées</label>
            <textarea value={budgetText} onChange={(e) => setBudgetText(e.target.value)} />
            <div className="hint">Une fourchette par ligne.</div>
          </div>
        </div>
      </div>

      <div className="adm-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "Cormorant, serif", fontWeight: 500, fontSize: 18, marginTop: 0 }}>SEO</h3>
        <div className="adm-form">
          <div className="adm-field">
            <label>Titre par défaut</label>
            <input type="text" value={v.seoDefaultTitle} onChange={(e) => set("seoDefaultTitle", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Description par défaut</label>
            <textarea value={v.seoDefaultDesc} onChange={(e) => set("seoDefaultDesc", e.target.value)} />
          </div>
        </div>
      </div>

      {error && <div className="adm-error" style={{ marginBottom: 16 }}>{error}</div>}
      {saved && <div className="adm-success" style={{ marginBottom: 16 }}>Enregistré.</div>}
      <button type="button" className="adm-btn primary" disabled={busy} onClick={save}>
        {busy ? "Enregistrement…" : "Enregistrer"}
      </button>
    </>
  );
}

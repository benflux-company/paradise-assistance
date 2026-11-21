"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/admin/ui/Card";
import { Input, Textarea, Label, FieldGroup, FieldHint } from "@/components/admin/ui/Field";
import Dropzone from "@/components/admin/ui/Dropzone";
import Button from "@/components/admin/ui/Button";
import type { ContentFieldDef } from "@/lib/siteContent";

export default function SiteContentManager({
  section,
  fields,
  values,
  uploadsEnabled,
}: {
  section: string;
  fields: ContentFieldDef[];
  values: Record<string, string>;
  uploadsEnabled: boolean;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, values[f.key] ?? f.default]))
  );
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const res = await fetch("/api/admin/site-content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) toast.error("Échec de l'enregistrement.");
    else {
      toast.success("Enregistré.");
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{section}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((f) =>
          f.type === "image" || f.type === "video" ? (
            <Dropzone
              key={f.key}
              label={f.label}
              value={draft[f.key]}
              onChange={(url) => setDraft((d) => ({ ...d, [f.key]: url }))}
              uploadsEnabled={uploadsEnabled}
              accept={f.type === "video" ? "video/*" : "image/*"}
              hint={f.hint}
            />
          ) : (
            <FieldGroup key={f.key}>
              <Label>{f.label}</Label>
              {f.type === "text" ? (
                <Input value={draft[f.key]} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} />
              ) : (
                <Textarea
                  value={draft[f.key]}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  className={f.type === "list" ? "min-h-32" : undefined}
                />
              )}
              {f.hint && <FieldHint>{f.hint}</FieldHint>}
            </FieldGroup>
          )
        )}
      </CardContent>
      <CardFooter>
        <Button loading={busy} onClick={save}>
          Enregistrer
        </Button>
      </CardFooter>
    </Card>
  );
}

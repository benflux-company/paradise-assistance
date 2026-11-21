"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Star, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/admin/ui/Card";
import Button from "@/components/admin/ui/Button";
import Badge from "@/components/admin/ui/Badge";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";
import { cn } from "@/lib/admin/cn";

type Img = { id: string; url: string; alt: string; cover: boolean };

export default function ImageManager({ projectId, images, uploadsEnabled }: { projectId: string; images: Img[]; uploadsEnabled: boolean }) {
  const confirm = useConfirm();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`/api/admin/projects/${projectId}/images`, { method: "POST", body: form });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Échec de l'import.");
    } else {
      toast.success("Photo ajoutée.");
      router.refresh();
    }
    setUploading(false);
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (!uploadsEnabled) {
      toast.error("Import indisponible (CLOUDINARY_URL manquant sur ce serveur).");
      return;
    }
    upload(file);
  }

  async function remove(img: Img) {
    const ok = await confirm({
      title: "Supprimer cette photo ?",
      description: img.cover ? "C'est la photo de couverture de cette réalisation — une autre sera utilisée à sa place." : undefined,
      confirmLabel: "Supprimer",
      destructive: true,
    });
    if (!ok) return;
    setBusy(true);
    await fetch(`/api/admin/projects/${projectId}/images?imageId=${img.id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
    toast.success("Photo supprimée.");
  }

  async function setCover(imageId: string) {
    setBusy(true);
    await fetch(`/api/admin/projects/${projectId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverImageId: imageId }),
    });
    router.refresh();
    setBusy(false);
    toast.success("Photo de couverture mise à jour.");
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = images.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setBusy(true);
    await fetch(`/api/admin/projects/${projectId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((i) => i.id) }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadsEnabled && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            L&apos;import d&apos;images n&apos;est pas encore configuré (CLOUDINARY_URL manquant). Demandez à votre prestataire de le configurer.
          </p>
        )}

        {images.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune photo pour cette réalisation.</p>
        ) : (
          <div className="space-y-2">
            {images.map((img, i) => (
              <div key={img.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <img src={img.url} alt={img.alt} className="size-10 shrink-0 rounded-md object-cover" />
                <div className="flex-1">
                  {img.cover ? <Badge variant="success">Photo de couverture</Badge> : <span className="text-sm text-muted-foreground">Photo {i + 1}</span>}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {!img.cover && (
                    <Button variant="ghost" size="icon" onClick={() => setCover(img.id)} disabled={busy} aria-label="Définir comme couverture">
                      <Star className="size-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label="Monter">
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => move(i, 1)} disabled={busy || i === images.length - 1} aria-label="Descendre">
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(img)} disabled={busy} aria-label="Supprimer">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          className={cn(
            "flex h-28 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted text-muted-foreground transition-colors",
            dragOver && "border-brand bg-brand-50",
            uploadsEnabled && "cursor-pointer hover:border-brand/60"
          )}
          onClick={() => uploadsEnabled && fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (uploadsEnabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin text-brand" />
          ) : (
            <>
              <ImagePlus className="size-5" />
              <span className="text-sm">{uploadsEnabled ? "Glissez une photo ou cliquez pour l'ajouter" : "Import indisponible"}</span>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </CardContent>
    </Card>
  );
}

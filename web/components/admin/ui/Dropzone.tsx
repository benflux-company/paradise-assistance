"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Pencil, Video as VideoIcon } from "lucide-react";
import { cn } from "@/lib/admin/cn";

export default function Dropzone({
  label,
  value,
  onChange,
  uploadsEnabled,
  accept = "image/*",
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  uploadsEnabled: boolean;
  accept?: string;
  hint?: string;
}) {
  const isVideo = accept.startsWith("video");
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Échec de l'import.");
      onChange(data.url);
      toast.success("Fichier importé.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'import.");
    } finally {
      setBusy(false);
    }
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

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-foreground">{label}</span>

      <div
        className={cn(
          "group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted transition-colors",
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
        {value ? (
          <>
            {isVideo ? (
              <video src={value} muted className="h-full w-full object-cover" />
            ) : (
              <img src={value} alt="" className="h-full w-full object-cover" />
            )}
            {uploadsEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-brand-700/0 opacity-0 transition-all group-hover:bg-brand-700/40 group-hover:opacity-100">
                <span className="flex items-center gap-1.5 rounded-md bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-dropdown">
                  <Pencil className="size-3.5" /> Remplacer
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {isVideo ? <VideoIcon className="size-6" /> : <ImagePlus className="size-6" />}
            <span className="text-xs">{uploadsEnabled ? "Glissez un fichier ou cliquez" : "Import indisponible"}</span>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80">
            <Loader2 className="size-6 animate-spin text-brand" />
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {!uploadsEnabled && !hint && (
        <p className="text-xs text-muted-foreground">CLOUDINARY_URL manquant sur ce serveur — l&apos;import de fichier est désactivé.</p>
      )}
    </div>
  );
}

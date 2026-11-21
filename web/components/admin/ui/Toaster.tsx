"use client";

import { Toaster as Sonner } from "sonner";

// Replaces window.alert()/raw error strings: call toast.success(...) /
// toast.error(...) (from "sonner") anywhere under the admin layout.
export default function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "admin-root flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-dropdown w-full",
          success: "border-success/30",
          error: "border-destructive/30",
          title: "font-medium",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}

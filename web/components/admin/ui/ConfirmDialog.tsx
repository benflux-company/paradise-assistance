"use client";

import { useState, useCallback, createContext, useContext } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

// Replaces window.confirm(): await confirm({ title, description }) instead
// of a blocking native dialog, resolving true/false from the modal buttons.
export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ options: ConfirmOptions; resolve: (v: boolean) => void } | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise((resolve) => setState({ options, resolve }));
  }, []);

  function handle(result: boolean) {
    state?.resolve(result);
    setState(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <Modal open title={state.options.title} description={state.options.description} onClose={() => handle(false)} size="sm">
          <div className="flex items-start gap-3">
            {state.options.destructive && (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="size-5 text-destructive" />
              </div>
            )}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => handle(false)}>
              {state.options.cancelLabel ?? "Annuler"}
            </Button>
            <Button variant={state.options.destructive ? "destructive" : "default"} size="sm" onClick={() => handle(true)}>
              {state.options.confirmLabel ?? "Confirmer"}
            </Button>
          </div>
        </Modal>
      )}
    </ConfirmContext.Provider>
  );
}

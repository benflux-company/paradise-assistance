"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

export default function RevealMain({
  id,
  dataT,
  dataDark,
  children,
}: {
  id: string;
  dataT: string;
  dataDark?: boolean;
  children: React.ReactNode;
}) {
  const mainRef = useRef<HTMLElement>(null);
  useReveal(mainRef);

  return (
    <main id={id} className="pg on" data-t={dataT} data-dark={dataDark ? "1" : undefined} ref={mainRef}>
      {children}
    </main>
  );
}

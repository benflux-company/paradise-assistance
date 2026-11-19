"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { isReducedMotion } from "@/lib/motion";

export default function ContactForm({
  projectTypes,
  budgetRanges,
}: {
  projectTypes: string[];
  budgetRanges: string[];
}) {
  const [ctp, setCtp] = useState(projectTypes[0] ?? "");
  const [cbd, setCbd] = useState(budgetRanges[budgetRanges.length - 1] ?? "");
  const [nameErr, setNameErr] = useState(false);
  const [contactErr, setContactErr] = useState(false);
  const [done, setDone] = useState(false);
  const [dmsg, setDmsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const againRef = useRef<HTMLButtonElement>(null);

  const shakeOnNextErrorRef = useRef(false);

  useEffect(() => {
    if (!shakeOnNextErrorRef.current) return;
    shakeOnNextErrorRef.current = false;
    if (isReducedMotion() || !formRef.current) return;
    const errEls = formRef.current.querySelectorAll(".fg.err");
    if (!errEls.length) return;
    ensureGsap();
    gsap.fromTo(errEls, { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1,.3)" });
  }, [nameErr, contactErr]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nameBad = !nameRef.current?.value.trim();
    const contactBad = !contactRef.current?.value.trim();
    setNameErr(nameBad);
    setContactErr(contactBad);

    if (nameBad || contactBad) {
      shakeOnNextErrorRef.current = true;
      if (nameBad) nameRef.current?.focus();
      else if (contactBad) contactRef.current?.focus();
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameRef.current!.value.trim(),
          contact: contactRef.current!.value.trim(),
          projectType: ctp,
          budget: cbd,
          message: messageRef.current?.value.trim() ?? "",
        }),
      });
      if (!res.ok) {
        setSubmitError("Une erreur est survenue. Merci de réessayer ou de nous contacter directement.");
        setSubmitting(false);
        return;
      }
    } catch {
      setSubmitError("Une erreur est survenue. Merci de réessayer ou de nous contacter directement.");
      setSubmitting(false);
      return;
    }

    setDmsg(`Votre demande pour : ${ctp.toLowerCase()} est bien enregistrée. Nous revenons vers vous rapidement pour fixer une visite.`);

    const finish = () => {
      setSubmitting(false);
      setDone(true);
      setTimeout(() => againRef.current?.focus(), 0);
    };

    if (!isReducedMotion() && formRef.current) {
      ensureGsap();
      gsap.to(formRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        onComplete: () => {
          finish();
        },
      });
    } else {
      finish();
    }
  }

  function again() {
    formRef.current?.reset();
    setNameErr(false);
    setContactErr(false);
    setCtp(projectTypes[0] ?? "");
    setCbd(budgetRanges[budgetRanges.length - 1] ?? "");
    setDone(false);
    gsap.set(formRef.current, { opacity: 1, y: 0 });
    setTimeout(() => nameRef.current?.focus(), 0);
  }

  return (
    <div>
      <form id="cf" noValidate style={{ display: done ? "none" : "flex", flexDirection: "column", gap: 40 }} ref={formRef} onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: 40 }}>
          <div className={`fg${nameErr ? " err" : ""}`} id="g-n">
            <input id="f-n" type="text" placeholder=" " autoComplete="name" ref={nameRef} />
            <label htmlFor="f-n">Nom complet</label>
            <span className="ln2"></span>
            <div className="em">Indiquez votre nom.</div>
          </div>
          <div className={`fg${contactErr ? " err" : ""}`} id="g-c">
            <input id="f-c" type="text" placeholder=" " autoComplete="tel" ref={contactRef} />
            <label htmlFor="f-c">Téléphone ou e-mail</label>
            <span className="ln2"></span>
            <div className="em">Indiquez un moyen de vous joindre.</div>
          </div>
        </div>
        <div>
          <div className="lab navy" id="lt">
            Type de projet
          </div>
          <div className="chips2" id="ctype" role="group" aria-labelledby="lt">
            {projectTypes.map((t) => (
              <button key={t} type="button" className="x" aria-pressed={t === ctp} onClick={() => setCtp(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="lab navy" id="lb2">
            Budget envisagé
          </div>
          <div className="chips2" id="cbud" role="group" aria-labelledby="lb2">
            {budgetRanges.map((b) => (
              <button key={b} type="button" className="x" aria-pressed={b === cbd} onClick={() => setCbd(b)}>
                {b}
              </button>
            ))}
          </div>
        </div>
        <div className="fg">
          <textarea id="f-m" rows={4} placeholder=" " ref={messageRef}></textarea>
          <label htmlFor="f-m">Votre projet : pièce, dimensions, délais</label>
          <span className="ln2"></span>
        </div>
        {submitError && (
          <p role="alert" style={{ color: "var(--err, #c0392b)", fontSize: 14 }}>
            {submitError}
          </p>
        )}
        <div>
          <button type="submit" className="btn fill mag" disabled={submitting}>
            <span className="t">
              <span>{submitting ? "Envoi…" : "Envoyer la demande"}</span>
              <span>{submitting ? "Envoi…" : "Envoyer la demande"}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </form>
      <div className="done" id="done" hidden={!done} aria-live="polite">
        <div className="ok">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <h2 className="sf" style={{ fontSize: "clamp(40px,4.6vw,68px)", lineHeight: 1.04, fontWeight: 300 }}>
          Merci, <em className="navy">c&apos;est noté.</em>
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--muted)", margin: "20px 0 10px", maxWidth: 460 }} id="dmsg">
          {dmsg}
        </p>
        <button type="button" className="btn" id="again" ref={againRef} onClick={again}>
          <span className="t">
            <span>Nouvelle demande</span>
            <span>Nouvelle demande</span>
          </span>
        </button>
      </div>
    </div>
  );
}

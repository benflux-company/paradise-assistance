"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { isReducedMotion } from "@/lib/motion";

const PROJECT_TYPES = ["Cuisine", "Dressing", "Mur TV", "Salle de bain", "Salon", "Aménagement complet"];
const BUDGETS = ["[TRANCHE 1]", "[TRANCHE 2]", "[TRANCHE 3]", "À définir"];

export default function ContactForm() {
  const [ctp, setCtp] = useState(PROJECT_TYPES[0]);
  const [cbd, setCbd] = useState(BUDGETS[3]);
  const [nameErr, setNameErr] = useState(false);
  const [contactErr, setContactErr] = useState(false);
  const [done, setDone] = useState(false);
  const [dmsg, setDmsg] = useState("");

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

  function handleSubmit(e: React.FormEvent) {
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

    setDmsg(`Votre demande pour : ${ctp.toLowerCase()} est bien enregistrée. Nous revenons vers vous rapidement pour fixer une visite.`);

    const finish = () => {
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
    setCtp(PROJECT_TYPES[0]);
    setCbd(BUDGETS[3]);
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
            {PROJECT_TYPES.map((t) => (
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
            {BUDGETS.map((b) => (
              <button key={b} type="button" className="x" aria-pressed={b === cbd} onClick={() => setCbd(b)}>
                {b}
              </button>
            ))}
          </div>
        </div>
        <div className="fg">
          <textarea id="f-m" rows={4} placeholder=" "></textarea>
          <label htmlFor="f-m">Votre projet : pièce, dimensions, délais</label>
          <span className="ln2"></span>
        </div>
        <div>
          <button type="submit" className="btn fill mag">
            <span className="t">
              <span>Envoyer la demande</span>
              <span>Envoyer la demande</span>
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
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 36 }}>Maquette : le formulaire n&apos;envoie pas encore de message.</p>
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

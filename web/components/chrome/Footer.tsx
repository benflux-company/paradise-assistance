"use client";

import Link from "next/link";
import { scrollToTop } from "@/lib/motion";
import { orPlaceholder } from "@/lib/placeholders";
import type { SettingsView } from "@/lib/queries";

function socialsLine(settings: SettingsView): string {
  const socials = [settings.facebook, settings.instagram, settings.tiktok, settings.whatsapp, settings.linkedin].filter(Boolean);
  return socials.length ? socials.join(" · ") : "[RÉSEAUX SOCIAUX]";
}

export default function Footer({ settings }: { settings: SettingsView }) {
  return (
    <footer className="ft ondark">
      <div className="wrap">
        <div className="grid">
          <div className="col">
            <img src="/img/logo-blanc.png" alt="Ets Paradise Assistance" style={{ height: 130, width: "auto" }} />
          </div>
          <div className="col">
            <div className="h">Navigation</div>
            <Link href="/" className="ul">
              Accueil
            </Link>
            <Link href="/portfolio" className="ul">
              Portfolio
            </Link>
            <Link href="/services" className="ul">
              Services
            </Link>
            <Link href="/blog" className="ul">
              Blog
            </Link>
            <Link href="/contact" className="ul">
              Contact
            </Link>
          </div>
          <div className="col">
            <div className="h">Expertises</div>
            <span>Cuisines sur mesure</span>
            <span>Dressings</span>
            <span>Murs TV</span>
            <span>Salles de bain</span>
            <span>Aménagement complet</span>
          </div>
          <div className="col">
            <div className="h">Contact</div>
            <span>{orPlaceholder(settings.phone, "[TÉLÉPHONE]")}</span>
            <span>{orPlaceholder(settings.email, "[ADRESSE E-MAIL]")}</span>
            <span>{orPlaceholder(settings.address, "[ADRESSE DU BUREAU]")}</span>
            <span>{socialsLine(settings)}</span>
          </div>
        </div>
        <div className="huge sf" id="huge">
          Paradise <em>Assistance</em>
        </div>
        <div className="bot">
          <span>© 2026 Ets Paradise Assistance. Tous droits réservés.</span>
          <span>Mentions légales</span>
          <button className="totop" type="button" id="totop" aria-label="Retour en haut" onClick={() => scrollToTop(1.6)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M12 20V5M6 11l6-6 6 6" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { scrollToTop } from "@/lib/motion";
import { orPlaceholder } from "@/lib/placeholders";
import type { SettingsView } from "@/lib/queries";
import { FacebookIcon, InstagramIcon, TiktokIcon, WhatsappIcon, LinkedinIcon } from "@/components/icons/SocialIcons";

// WhatsApp est stocké comme numéro de téléphone (ex. "+243 991 836 082") et
// converti ici en lien wa.me ; les autres réseaux sont déjà des URLs completes.
function whatsappHref(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export default function Footer({ settings }: { settings: SettingsView }) {
  return (
    <footer className="ft ondark">
      <div className="wrap">
        <div className="grid">
          <div className="col">
            <img src="/img/logo-blanc.png" alt="Ets Paradis Assistance" style={{ height: 130, width: "auto" }} />
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
            {settings.email ? (
              <a href={`mailto:${settings.email}`} className="ul">
                {settings.email}
              </a>
            ) : (
              <span>[ADRESSE E-MAIL]</span>
            )}
            <span>{orPlaceholder(settings.address, "[ADRESSE DU BUREAU]")}</span>
            <div className="soc" style={{ display: "flex", gap: 14, marginTop: 8 }}>
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FacebookIcon />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon />
                </a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <TiktokIcon />
                </a>
              )}
              {settings.whatsapp && (
                <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <WhatsappIcon />
                </a>
              )}
              {settings.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedinIcon />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="huge sf" id="huge">
          Paradis <em>Assistance</em>
        </div>
        <div className="bot">
          <span>© 2026 Ets Paradis Assistance. Tous droits réservés.</span>
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

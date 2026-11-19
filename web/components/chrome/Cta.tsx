import Link from "next/link";
import Arrow from "@/components/icons/Arrow";

export default function Cta({ hidden }: { hidden: boolean }) {
  return (
    <section className="cta ondark" id="cta" hidden={hidden}>
      <div className="bg">
        <img src="/img/cuisine-dore.jpg" alt="" loading="lazy" />
      </div>
      <div className="ov"></div>
      <div className="ct wrap">
        <div className="lab" style={{ color: "var(--lav)" }} data-up>
          Votre projet commence ici
        </div>
        <h2 className="sf" style={{ margin: "32px 0 48px" }} data-split>
          <span className="ln">
            <span>Créons votre</span>
          </span>
          <span className="ln">
            <span>
              <em>intérieur</em>
            </span>
          </span>
        </h2>
        <Link href="/contact" className="btn wh mag">
          <span className="t">
            <span>Demander un devis</span>
            <span>Demander un devis</span>
          </span>
          <Arrow />
        </Link>
      </div>
    </section>
  );
}

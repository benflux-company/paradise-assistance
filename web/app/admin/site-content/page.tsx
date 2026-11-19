import { getSiteContent, CONTENT_FIELDS } from "@/lib/siteContent";
import { uploadsConfigured } from "@/lib/upload";
import SiteContentManager from "./SiteContentManager";

export const dynamic = "force-dynamic";

export default async function SiteContentAdminPage() {
  const values = await getSiteContent();
  const sections = Array.from(new Set(CONTENT_FIELDS.map((f) => f.section)));

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Contenu du site</h1>
          <p>Textes et images des en-têtes, de l&apos;accueil et des pages qui ne sont pas des réalisations ou des articles.</p>
        </div>
      </div>
      {sections.map((section) => (
        <SiteContentManager
          key={section}
          section={section}
          fields={CONTENT_FIELDS.filter((f) => f.section === section)}
          values={values}
          uploadsEnabled={uploadsConfigured()}
        />
      ))}
    </>
  );
}

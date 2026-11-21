import { getSiteContent, CONTENT_FIELDS } from "@/lib/siteContent";
import { uploadsConfigured } from "@/lib/upload";
import PageHeader from "@/components/admin/layout/PageHeader";
import SiteContentManager from "./SiteContentManager";

export const dynamic = "force-dynamic";

export default async function SiteContentAdminPage() {
  const values = await getSiteContent();
  const sections = Array.from(new Set(CONTENT_FIELDS.map((f) => f.section)));

  return (
    <>
      <PageHeader
        title="Contenu du site"
        description="Textes et images des en-têtes, de l'accueil et des pages qui ne sont pas des réalisations ou des articles."
      />
      <div className="space-y-6">
        {sections.map((section) => (
          <SiteContentManager
            key={section}
            section={section}
            fields={CONTENT_FIELDS.filter((f) => f.section === section)}
            values={values}
            uploadsEnabled={uploadsConfigured()}
          />
        ))}
      </div>
    </>
  );
}

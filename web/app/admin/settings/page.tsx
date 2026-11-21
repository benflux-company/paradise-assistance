import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/layout/PageHeader";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const settings = await prisma.settings.findUnique({ where: { id: "settings" } });

  return (
    <>
      <PageHeader title="Paramètres" description="Coordonnées, réseaux sociaux et options du formulaire de contact." />
      <SettingsForm
        initial={{
          phone: settings?.phone ?? "",
          email: settings?.email ?? "",
          address: settings?.address ?? "",
          hours: settings?.hours ?? "",
          facebook: settings?.facebook ?? "",
          instagram: settings?.instagram ?? "",
          tiktok: settings?.tiktok ?? "",
          whatsapp: settings?.whatsapp ?? "",
          linkedin: settings?.linkedin ?? "",
          budgetRanges: settings?.budgetRanges ?? [],
          projectTypes: settings?.projectTypes ?? [],
          mapEmbed: settings?.mapEmbed ?? "",
          contactEmail: settings?.contactEmail ?? "",
          seoDefaultTitle: settings?.seoDefaultTitle ?? "",
          seoDefaultDesc: settings?.seoDefaultDesc ?? "",
        }}
      />
    </>
  );
}

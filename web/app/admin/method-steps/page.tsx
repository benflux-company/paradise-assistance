import { prisma } from "@/lib/prisma";
import { uploadsConfigured } from "@/lib/upload";
import PageHeader from "@/components/admin/layout/PageHeader";
import MethodStepManager from "./MethodStepManager";

export const dynamic = "force-dynamic";

export default async function MethodStepsAdminPage() {
  const steps = await prisma.methodStep.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <PageHeader title="Méthode" description="Les étapes affichées dans la section « Notre méthode »." />
      <MethodStepManager
        uploadsEnabled={uploadsConfigured()}
        initial={steps.map((s) => ({ id: s.id, title: s.title, description: s.description, image: s.image }))}
      />
    </>
  );
}

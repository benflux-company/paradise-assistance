import { prisma } from "@/lib/prisma";
import { uploadsConfigured } from "@/lib/upload";
import MethodStepManager from "./MethodStepManager";

export const dynamic = "force-dynamic";

export default async function MethodStepsAdminPage() {
  const steps = await prisma.methodStep.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Méthode</h1>
          <p>Les étapes affichées dans la section « Notre méthode ».</p>
        </div>
      </div>
      <MethodStepManager
        uploadsEnabled={uploadsConfigured()}
        initial={steps.map((s) => ({ id: s.id, title: s.title, description: s.description, image: s.image }))}
      />
    </>
  );
}

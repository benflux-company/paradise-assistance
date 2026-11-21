import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/layout/PageHeader";
import RequestsTable from "./RequestsTable";

export const dynamic = "force-dynamic";

export default async function ContactRequestsAdminPage() {
  const requests = await prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader title="Demandes de contact" description={`${requests.length} demande(s) reçue(s) via le formulaire de contact.`} />
      <RequestsTable
        requests={requests.map((r) => ({
          id: r.id,
          name: r.name,
          contact: r.contact,
          projectType: r.projectType,
          budget: r.budget,
          message: r.message,
          status: r.status,
          note: r.note,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </>
  );
}

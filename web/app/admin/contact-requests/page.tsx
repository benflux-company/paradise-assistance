import { prisma } from "@/lib/prisma";
import RequestsTable from "./RequestsTable";

export const dynamic = "force-dynamic";

export default async function ContactRequestsAdminPage() {
  const requests = await prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Demandes de contact</h1>
          <p>{requests.length} demande(s) reçue(s) via le formulaire de contact.</p>
        </div>
      </div>
      <div className="adm-card" style={{ padding: 0, overflowX: "auto" }}>
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
      </div>
    </>
  );
}

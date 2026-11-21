import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/layout/PageHeader";
import FaqManager from "./FaqManager";

export const dynamic = "force-dynamic";

export default async function FaqsAdminPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <PageHeader title="FAQ" description="Questions fréquentes affichées sur le site." />
      <FaqManager initial={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
    </>
  );
}

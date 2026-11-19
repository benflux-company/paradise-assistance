import { prisma } from "@/lib/prisma";
import FaqManager from "./FaqManager";

export const dynamic = "force-dynamic";

export default async function FaqsAdminPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>FAQ</h1>
          <p>Questions fréquentes affichées sur le site.</p>
        </div>
      </div>
      <FaqManager initial={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
    </>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/admin/layout/PageHeader";
import Button from "@/components/admin/ui/Button";
import ProjectForm from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <PageHeader
        title="Nouvelle réalisation"
        description="Les photos se gèrent après la création."
        actions={
          <Link href="/admin/projects">
            <Button variant="outline">
              <ArrowLeft className="size-4" /> Retour
            </Button>
          </Link>
        }
      />
      <ProjectForm />
    </>
  );
}

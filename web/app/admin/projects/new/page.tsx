import Link from "next/link";
import ProjectForm from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Nouvelle réalisation</h1>
          <p>Les photos se gèrent après la création.</p>
        </div>
        <Link href="/admin/projects" className="adm-btn">
          Retour
        </Link>
      </div>
      <div className="adm-card">
        <ProjectForm />
      </div>
    </>
  );
}

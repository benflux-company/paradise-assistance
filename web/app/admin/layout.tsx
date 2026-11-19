import { getSession } from "@/lib/auth";
import AdminNav from "./AdminNav";
import "./admin.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // The login page has no sidebar/session chrome — render it standalone.
  // Middleware already redirects unauthenticated requests before they reach
  // any other /admin page, but this layout wraps the login page too.
  if (!session) {
    return <div className="adm">{children}</div>;
  }

  return (
    <div className="adm">
      <div className="adm-shell">
        <AdminNav userName={session.name} />
        <main className="adm-main">{children}</main>
      </div>
    </div>
  );
}

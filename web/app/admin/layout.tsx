import { getSession } from "@/lib/auth";
import AdminShell from "@/components/admin/layout/AdminShell";
import "./admin-tailwind.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // The login page has no sidebar/session chrome — render it standalone.
  // Middleware already redirects unauthenticated requests before they reach
  // any other /admin page, but this layout wraps the login page too.
  if (!session) {
    return <div className="admin-root">{children}</div>;
  }

  return (
    <div className="admin-root">
      <AdminShell userName={session.name}>{children}</AdminShell>
    </div>
  );
}

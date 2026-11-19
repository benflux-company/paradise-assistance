import { getSession } from "@/lib/auth";
import AccountForm from "./AccountForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Mon compte</h1>
          <p>{session?.email}</p>
        </div>
      </div>
      <div className="adm-card">
        <AccountForm />
      </div>
    </>
  );
}

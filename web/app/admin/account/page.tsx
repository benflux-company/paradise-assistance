import { getSession } from "@/lib/auth";
import PageHeader from "@/components/admin/layout/PageHeader";
import AccountForm from "./AccountForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();

  return (
    <>
      <PageHeader title="Mon compte" description={session?.email} />
      <AccountForm />
    </>
  );
}

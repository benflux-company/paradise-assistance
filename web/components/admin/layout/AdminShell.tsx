import Sidebar from "./Sidebar";
import Toaster from "@/components/admin/ui/Toaster";
import { ConfirmProvider } from "@/components/admin/ui/ConfirmDialog";

export default function AdminShell({ userName, children }: { userName: string; children: React.ReactNode }) {
  return (
    <ConfirmProvider>
      <div className="min-h-screen bg-background">
        <Sidebar userName={userName} />
        <main className="min-h-screen py-8 pr-8 pl-72">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
      <Toaster />
    </ConfirmProvider>
  );
}

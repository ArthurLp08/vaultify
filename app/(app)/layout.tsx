import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SidebarProvider } from "@/components/sidebar/sidebar-provider";
import { VaultProvider } from "@/components/vault/vault-provider";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <SidebarProvider>
      <Sidebar />
      <main className="flex flex-1 flex-col lg:pl-64">
        <VaultProvider>{children}</VaultProvider>
      </main>
    </SidebarProvider>
  );
}

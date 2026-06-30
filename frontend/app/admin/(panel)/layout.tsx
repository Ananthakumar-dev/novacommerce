import { requireAdminProfile } from "@/lib/auth"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import { AdminSidebar } from "./admin-sidebar"

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await requireAdminProfile()

  return (
    <SidebarProvider>
      <AdminSidebar profile={profile} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <div className="text-sm font-medium">NovaCommerce Admin</div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

import type { Metadata } from "next"
import { BarChart3, Boxes, ClipboardList, ShieldCheck } from "lucide-react"

import { requireAdminProfile } from "@/lib/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Admin Dashboard | NovaCommerce",
  description: "NovaCommerce admin dashboard.",
}

export default async function AdminDashboardPage() {
  const profile = await requireAdminProfile()

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-muted-foreground">NovaCommerce Admin</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Dashboard
            </h1>
          </div>
          <Card size="sm" className="w-full max-w-sm">
            <CardContent>
              <p className="text-sm font-medium">{profile.fullName}</p>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>
              <div>
                <CardTitle>Admin session active</CardTitle>
                <CardDescription>
                  Your token is stored in an HTTP-only cookie and this
                  dashboard is protected by the auth service profile endpoint.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Orders",
              value: "Coming next",
              icon: ClipboardList,
            },
            {
              title: "Products",
              value: "Coming next",
              icon: Boxes,
            },
            {
              title: "Analytics",
              value: "Coming next",
              icon: BarChart3,
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted">
                  <item.icon
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.value}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

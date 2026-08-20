"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Boxes, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MerchantNav() {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Products",
      href: "/dashboard/products",
      icon: Package,
      active: pathname.startsWith("/dashboard/products"),
    },
    {
      label: "Inventory",
      href: "/dashboard/inventory",
      icon: Boxes,
      active: pathname.startsWith("/dashboard/inventory"),
    },
  ]

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
      <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-muted/40 rounded-xl border border-border/40">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
                item.active
                  ? "bg-white dark:bg-zinc-900 text-sky-700 dark:text-sky-400 shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <Button asChild size="sm" className="bg-sky-600 hover:bg-sky-700 text-white gap-1.5 shadow-xs">
          <Link href="/dashboard/products/add">
            <Plus className="size-4" />
            <span>Add Product</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

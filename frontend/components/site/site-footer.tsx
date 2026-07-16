import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  listStorefrontCategories,
  type StorefrontCategory,
} from "@/lib/storefront"

type SiteFooterProps = {
  categories?: StorefrontCategory[]
}

export async function SiteFooter({ categories }: SiteFooterProps = {}) {
  const shopCategories = (categories ?? await listStorefrontCategories()).slice(0, 4)

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Nova<span className="text-sky-700">Commerce</span>
          </Link>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            A modern shopping experience for quality products, quick discovery,
            and dependable checkout flows.
          </p>
          <div className="flex max-w-sm gap-2">
            <Input placeholder="Email address" />
            <Button>Join</Button>
          </div>
        </div>
        <div className="grid gap-2 text-sm">
          <h3 className="font-medium">Shop</h3>
          {shopCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/?category=${category.slug}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
          {shopCategories.length === 0 ? (
            <span className="text-muted-foreground">Categories coming soon</span>
          ) : null}
        </div>
        <div className="grid gap-2 text-sm">
          <h3 className="font-medium">Help</h3>
          {["Contact", "Returns", "Shipping", "Privacy"].map((item) => (
            <Link key={item} href="/" className="text-muted-foreground hover:text-foreground">
              {item}
            </Link>
          ))}
        </div>
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>© 2026 NovaCommerce. All rights reserved.</span>
        <span>Storefront preview</span>
      </div>
    </footer>
  )
}

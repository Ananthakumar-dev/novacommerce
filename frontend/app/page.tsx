import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  RotateCcw,
  Truck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  categories,
  featuredCollections,
  products,
} from "@/components/site/commerce-data"
import { ProductCard } from "@/components/site/product-card"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

const services = [
  { title: "Fast delivery", caption: "Priority shipping on popular products", icon: Truck },
  { title: "Secure payments", caption: "Protected card, UPI and wallet checkout", icon: CreditCard },
  { title: "Easy returns", caption: "Simple replacement and refund flows", icon: RotateCcw },
  { title: "Verified picks", caption: "Curated listings with clear product signals", icon: BadgeCheck },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b bg-muted/30">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.5fr_0.8fr] lg:px-8">
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 sm:p-8">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-[linear-gradient(135deg,rgba(2,132,199,0.16),rgba(16,185,129,0.12),rgba(245,158,11,0.14))]" />
              <div className="relative max-w-xl space-y-5">
                <Badge variant="secondary">Big savings week</Badge>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    Shop smarter with NovaCommerce
                  </h1>
                  <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                    Discover phones, audio, fashion, home essentials, and daily
                    deals in one clean storefront.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="lg" asChild>
                    <Link href="#popular-products">
                      Shop now
                      <ArrowRight />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#deals">View deals</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div id="deals" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                ["Up to 45% off", "Electronics and accessories"],
                ["Free delivery", "On selected everyday essentials"],
                ["Bank offers", "Extra savings on cards and UPI"],
              ].map(([title, caption]) => (
                <Card key={title} className="rounded-lg">
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{caption}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Shop by category</h2>
              <p className="text-sm text-muted-foreground">
                Quick paths into the most-used shopping sections.
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/">View all</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.name}
                  href="/"
                  className="rounded-lg border bg-card p-4 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className={`mb-3 flex size-10 items-center justify-center rounded-lg ${category.tone}`}>
                    <Icon className="size-5" />
                  </span>
                  <span className="font-medium">{category.name}</span>
                </Link>
              )
            })}
          </div>
        </section>

        <Separator />

        <section
          id="popular-products"
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Popular products</h2>
              <p className="text-sm text-muted-foreground">
                Static product cards ready to connect with the backend later.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/product/nova-x1-smartphone">Open sample product</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        <section className="bg-muted/30">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
            {featuredCollections.map((collection) => (
              <div key={collection.title} className="rounded-lg border bg-background p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{collection.title}</h2>
                    <p className="text-sm text-muted-foreground">{collection.caption}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/">Explore</Link>
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {collection.productSlugs.map((slug) => {
                    const product = products.find((item) => item.slug === slug) ?? products[0]
                    return (
                      <Link
                        key={slug}
                        href={`/product/${product.slug}`}
                        className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      >
                        <p className="line-clamp-2 min-h-10 text-sm font-medium">
                          {product.name}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {product.category}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.title} className="rounded-lg">
                  <CardContent className="flex gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-medium">{service.title}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {service.caption}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

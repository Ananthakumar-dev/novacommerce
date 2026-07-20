import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Headphones,
  Home as HomeIcon,
  Laptop,
  Package,
  RotateCcw,
  Shirt,
  Smartphone,
  Sparkles,
  Truck,
  Watch,
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
import { ProductCard } from "@/components/site/product-card"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import {
  listFeaturedProducts,
  listPopularProducts,
  listStorefrontCategories,
  listStorefrontProducts,
  type StorefrontCategory,
} from "@/lib/storefront"

const services = [
  { title: "Fast delivery", caption: "Priority shipping on popular products", icon: Truck },
  { title: "Secure payments", caption: "Protected card, UPI and wallet checkout", icon: CreditCard },
  { title: "Easy returns", caption: "Simple replacement and refund flows", icon: RotateCcw },
  { title: "Verified picks", caption: "Curated listings with clear product signals", icon: BadgeCheck },
]

const categoryIconMap = {
  audio: Headphones,
  beauty: Sparkles,
  electronics: Laptop,
  fashion: Shirt,
  health: BadgeCheck,
  home: HomeIcon,
  mobiles: Smartphone,
  mobile: Smartphone,
  smartphones: Smartphone,
  watches: Watch,
  watch: Watch,
}

const categoryTones = [
  "bg-sky-50 text-sky-700",
  "bg-violet-50 text-violet-700",
  "bg-rose-50 text-rose-700",
  "bg-emerald-50 text-emerald-700",
  "bg-amber-50 text-amber-700",
  "bg-lime-50 text-lime-700",
  "bg-fuchsia-50 text-fuchsia-700",
]

export default async function Home() {
  const [
    storefrontCategories,
    popularProducts,
    featuredProducts,
    latestProducts,
  ] = await Promise.all([
    listStorefrontCategories(),
    listPopularProducts(12),
    listFeaturedProducts(6),
    listStorefrontProducts(12),
  ])
  const productGrid = popularProducts.length > 0 ? popularProducts : latestProducts
  const collectionSections = [
    {
      title: "Featured products",
      caption: "Products selected for storefront promotion",
      products: featuredProducts.slice(0, 3),
    },
    {
      title: "New arrivals",
      caption: "Recently added active products",
      products: latestProducts.slice(0, 3),
    },
  ].filter((section) => section.products.length > 0)
  const sampleProductSlug = productGrid[0]?.slug ?? latestProducts[0]?.slug

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader categories={storefrontCategories} />
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
                    <Link href="/products">
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
            {storefrontCategories.length > 0 ? (
              <Button variant="ghost" asChild>
                <Link href="/">View all</Link>
              </Button>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {storefrontCategories.map((category, index) => {
              const Icon = getCategoryIcon(category)
              const tone = categoryTones[index % categoryTones.length]
              return (
                <Link
                  key={category.slug}
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="rounded-lg border bg-card p-4 text-sm transition-colors hover:bg-muted/50"
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="mb-3 size-10 rounded-lg object-cover"
                    />
                  ) : (
                    <span className={`mb-3 flex size-10 items-center justify-center rounded-lg ${tone}`}>
                      <Icon className="size-5" />
                    </span>
                  )}
                  <span className="font-medium">{category.name}</span>
                </Link>
              )
            })}
            {storefrontCategories.length === 0 ? (
              <Card className="col-span-full rounded-lg">
                <CardContent className="text-sm text-muted-foreground">
                  Categories will appear here after active categories are added.
                </CardContent>
              </Card>
            ) : null}
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
                Live products marked popular in the product catalog.
              </p>
            </div>
            {sampleProductSlug ? (
              <Button variant="outline" asChild>
                <Link href={`/product/${sampleProductSlug}`}>Open sample product</Link>
              </Button>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {productGrid.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
            {productGrid.length === 0 ? (
              <Card className="col-span-full rounded-lg">
                <CardContent className="text-sm text-muted-foreground">
                  Products will appear here after active products are added.
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>

        {collectionSections.length > 0 ? (
          <section className="bg-muted/30">
            <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
              {collectionSections.map((collection) => (
                <div key={collection.title} className="rounded-lg border bg-background p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{collection.title}</h2>
                    <p className="text-sm text-muted-foreground">{collection.caption}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/products">Explore</Link>
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {collection.products.map((product) => (
                    <Link
                      key={product.slug}
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
                  ))}
                </div>
              </div>
              ))}
            </div>
          </section>
        ) : null}

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
      <SiteFooter categories={storefrontCategories} />
    </div>
  )
}

function getCategoryIcon(category: StorefrontCategory) {
  const iconKey = (category.icon ?? category.slug ?? category.name)
    .toLowerCase()
    .replace(/[^a-z]/g, "") as keyof typeof categoryIconMap

  return categoryIconMap[iconKey] ?? Package
}

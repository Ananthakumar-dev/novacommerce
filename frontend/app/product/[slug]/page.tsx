import Link from "next/link"
import {
  BadgeCheck,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  discountPercent,
  formatPrice,
  getProductBySlug,
  products,
} from "@/components/site/commerce-data"
import { ProductCard } from "@/components/site/product-card"
import { ProductVisual } from "@/components/site/product-visual"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { listStorefrontCategories } from "@/lib/storefront"

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  const categories = await listStorefrontCategories()
  const relatedProducts = products.filter((item) => item.slug !== product.slug).slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader categories={categories} />
      <main>
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">{product.category}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.1fr_0.75fr] lg:px-8">
          <div className="space-y-3">
            <ProductVisual
              name={product.name}
              imageTone={product.imageTone}
              accent={product.accent}
              className="rounded-lg border"
            />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((item) => (
                <button
                  key={item}
                  className="aspect-square rounded-lg border bg-muted/30 p-2 transition-colors hover:bg-muted"
                  aria-label={`View product image ${item}`}
                >
                  <ProductVisual
                    name={`${product.name} preview ${item}`}
                    imageTone={product.imageTone}
                    accent={product.accent}
                    className="h-full rounded-md"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{product.badge}</Badge>
                <Badge variant="outline">{product.brand}</Badge>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <BadgeCheck className="size-3" />
                  In stock
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {product.name}
                </h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {product.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2 py-1 text-sm font-medium text-white">
                  {product.rating}
                  <Star className="size-3 fill-white" />
                </span>
                <span className="text-sm text-muted-foreground">
                  {product.reviews.toLocaleString("en-IN")} ratings and reviews
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-semibold">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm font-medium text-emerald-700">
                  {discountPercent(product.price, product.originalPrice)}% off
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Inclusive of all taxes. Shipping calculated at checkout.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Label>Color</Label>
                <RadioGroup defaultValue="graphite" className="flex flex-wrap gap-2">
                  {["Graphite", "Silver", "Ocean"].map((color) => (
                    <Label
                      key={color}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                    >
                      <RadioGroupItem value={color.toLowerCase()} />
                      {color}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-3">
                <Label>Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Minus />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <Input className="w-16 text-center" value="1" readOnly />
                  <Button variant="outline" size="icon">
                    <Plus />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button size="lg">
                <ShoppingCart />
                Add to cart
              </Button>
              <Button size="lg" variant="secondary">
                <Zap />
                Buy now
              </Button>
            </div>
          </div>

          <aside className="space-y-4">
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Delivery options</CardTitle>
                <CardDescription>Check serviceability and delivery speed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input placeholder="Enter pincode" />
                  <Button variant="outline">Check</Button>
                </div>
                <div className="grid gap-3 text-sm">
                  <span className="flex gap-2">
                    <Truck className="size-4 text-sky-700" />
                    Free delivery by this week
                  </span>
                  <span className="flex gap-2">
                    <ShieldCheck className="size-4 text-emerald-700" />
                    7 day replacement available
                  </span>
                  <span className="flex gap-2">
                    <MapPin className="size-4 text-amber-700" />
                    Ships from verified seller
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Available offers</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="rounded-lg border p-3">
                  10% instant discount on selected bank cards.
                </div>
                <div className="rounded-lg border p-3">
                  Extra coupon savings at checkout.
                </div>
                <div className="rounded-lg border p-3">
                  No-cost EMI options available.
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full">
              <Heart />
              Save for later
            </Button>
          </aside>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="questions">Q&amp;A</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle>Product overview</CardTitle>
                  <CardDescription>
                    A static content area that can later be populated from product APIs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-3">
                  <p>
                    {product.description} The page layout supports long copy,
                    offer blocks, variants, seller details, and product policies.
                  </p>
                  <p>
                    Keep product images, pricing, stock status, and rating data
                    separate so backend integration can replace the mock source.
                  </p>
                  <p>
                    The buy box is placed above the fold on desktop and remains
                    easy to scan on mobile screens.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specs">
              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {[
                        ["Brand", product.brand],
                        ["Category", product.category],
                        ["Model", product.slug],
                        ["Warranty", "1 year manufacturer warranty"],
                        ["Return policy", "7 day replacement"],
                      ].map(([label, value]) => (
                        <TableRow key={label}>
                          <TableCell className="font-medium">{label}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="grid gap-4 lg:grid-cols-[0.7fr_1fr]">
                <Card className="rounded-lg">
                  <CardHeader>
                    <CardTitle>Customer ratings</CardTitle>
                    <CardDescription>Based on static review data.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-semibold">{product.rating}</span>
                      <span className="pb-1 text-sm text-muted-foreground">out of 5</span>
                    </div>
                    <Textarea placeholder="Write a review preview" />
                    <Button>Submit review</Button>
                  </CardContent>
                </Card>
                <div className="grid gap-3">
                  {["Excellent value for the price.", "Delivery was quick and packaging was clean."].map((review) => (
                    <Card key={review} className="rounded-lg">
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Verified buyer</Badge>
                          <span className="text-sm font-medium">4.5</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="questions">
              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle>Questions and answers</CardTitle>
                  <CardDescription>
                    Ask product questions before purchasing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <Input placeholder="Ask about this product" />
                  <Button>Ask</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Related products</h2>
                <p className="text-sm text-muted-foreground">
                  More options from nearby categories.
                </p>
              </div>
              <Select defaultValue="popular">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="price-low">Price low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

import Link from "next/link"
import { ShoppingCart, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  discountPercent,
  formatPrice,
} from "@/components/site/commerce-data"
import { ProductVisual } from "@/components/site/product-visual"

export type ProductCardProduct = {
  name: string
  slug: string
  category: string
  brand?: string
  price: number
  salePrice?: number | null
  originalPrice?: number
  imageUrl?: string | null
  imageTone?: string
  accent?: string
  badge?: string
  rating?: number
  reviews?: number
  popular?: boolean
  featured?: boolean
}

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const currentPrice = product.salePrice ?? product.price
  const originalPrice = product.originalPrice ?? product.price
  const hasDiscount = originalPrice > currentPrice
  const badge =
    product.badge ??
    (product.popular ? "Popular" : product.featured ? "Featured" : product.category)

  return (
    <Card className="h-full gap-3 rounded-lg py-3 transition-colors hover:ring-foreground/20">
      <CardContent className="space-y-3 px-3">
        <Link href={`/product/${product.slug}`} className="block">
          <ProductVisual
            name={product.name}
            imageTone={product.imageTone}
            accent={product.accent}
            imageUrl={product.imageUrl}
          />
        </Link>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">{badge}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {product.rating ?? "New"}
            </span>
          </div>
          <Link
            href={`/product/${product.slug}`}
            className="line-clamp-2 min-h-10 text-sm font-medium leading-5 hover:underline"
          >
            {product.name}
          </Link>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-base font-semibold">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount ? (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-xs font-medium text-emerald-700">
                  {discountPercent(currentPrice, originalPrice)}% off
                </span>
              </>
            ) : null}
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto border-t-0 bg-transparent px-3 pt-0">
        <Button className="w-full" variant="outline">
          <ShoppingCart />
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  )
}

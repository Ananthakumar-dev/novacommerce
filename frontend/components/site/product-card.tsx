import Link from "next/link"
import { ShoppingCart, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  discountPercent,
  formatPrice,
  products,
} from "@/components/site/commerce-data"
import { ProductVisual } from "@/components/site/product-visual"

type Product = (typeof products)[number]

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="h-full gap-3 rounded-lg py-3 transition-colors hover:ring-foreground/20">
      <CardContent className="space-y-3 px-3">
        <Link href={`/product/${product.slug}`} className="block">
          <ProductVisual
            name={product.name}
            imageTone={product.imageTone}
            accent={product.accent}
          />
        </Link>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">{product.badge}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {product.rating}
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
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-xs font-medium text-emerald-700">
              {discountPercent(product.price, product.originalPrice)}% off
            </span>
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

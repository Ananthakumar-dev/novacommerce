"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useCart } from "@/components/providers/cart-provider"
import { useCustomerAuth } from "@/components/providers/customer-auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { formatPrice } from "@/components/site/commerce-data"

export default function CartPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useCustomerAuth()
  const { cart, isLoading: isCartLoading, updateQuantity, removeItem } = useCart()
  const [busyItems, setBusyItems] = useState<Record<number, boolean>>({})
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const handleUpdateQty = async (itemId: number, currentQty: number, change: number, stockQty: number) => {
    const newQty = currentQty + change
    if (newQty < 1) return
    if (newQty > stockQty) {
      toast.warning(`Only ${stockQty} items available in stock.`)
      return
    }

    setBusyItems((prev) => ({ ...prev, [itemId]: true }))
    try {
      const success = await updateQuantity(itemId, newQty)
      if (success) {
        toast.success("Cart updated.")
      }
    } finally {
      setBusyItems((prev) => ({ ...prev, [itemId]: false }))
    }
  }

  const handleRemoveItem = async (itemId: number, productName: string) => {
    setBusyItems((prev) => ({ ...prev, [itemId]: true }))
    try {
      const success = await removeItem(itemId)
      if (success) {
        toast.success(`Removed ${productName} from cart.`)
      }
    } finally {
      setBusyItems((prev) => ({ ...prev, [itemId]: false }))
    }
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  const subtotal = cart?.subtotal ?? 0
  // Free shipping above 5000 INR, else 150 INR shipping fee.
  const shippingThreshold = 5000
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 150
  // Estimated 18% GST tax
  const gstTax = Math.round(subtotal * 0.18)
  const grandTotal = subtotal + shippingFee + gstTax

  const showLoading = isAuthLoading || (isCartLoading && !cart)

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* Back button */}
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="flex items-baseline justify-between border-b pb-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Shopping Cart</h1>
            {cart && cart.items.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {showLoading ? (
            /* SKELETON LOADING STATE */
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="p-4 flex gap-4 items-center">
                    <Skeleton className="size-20 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </Card>
                ))}
              </div>
              <Card className="p-6 h-[280px] space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <Separator />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </Card>
            </div>
          ) : !user ? (
            /* SIGN IN REQUIRED STATE */
            <div className="text-center py-16 bg-background rounded-2xl border shadow-sm max-w-md mx-auto my-8 p-8 space-y-6">
              <div className="mx-auto size-16 rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center">
                <ShoppingBag className="size-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Please Sign In</h3>
                <p className="text-sm text-muted-foreground">
                  You must be signed in to access and manage your shopping cart.
                </p>
              </div>
              <Button asChild className="w-full bg-sky-700 hover:bg-sky-800 text-white">
                <Link href="/login?redirect=/cart">Sign In to Account</Link>
              </Button>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            /* EMPTY CART STATE */
            <div className="text-center py-20 bg-background rounded-2xl border shadow-sm max-w-lg mx-auto my-8 p-8 space-y-6">
              <div className="mx-auto size-16 rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center">
                <ShoppingBag className="size-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Looks like you haven&apos;t added anything to your cart yet. Explore our products to find great deals!
                </p>
              </div>
              <Button asChild className="px-6 bg-sky-700 hover:bg-sky-800 text-white font-medium">
                <Link href="/products">Explore Products</Link>
              </Button>
            </div>
          ) : (
            /* MAIN CART VIEW */
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              {/* Items List */}
              <div className="space-y-4">
                {cart.items.map((item) => {
                  const isBusy = busyItems[item.id] || false
                  const itemUnitPrice = item.salePrice ?? item.price
                  const itemSubtotal = itemUnitPrice * item.quantity

                  return (
                    <Card key={item.id} className="relative overflow-hidden transition-all border-border/60 hover:shadow-md">
                      {isBusy && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-xs flex items-center justify-center z-10 animate-fade-in">
                          <Loader2 className="size-6 animate-spin text-sky-700" />
                        </div>
                      )}
                      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex gap-4 items-center min-w-0">
                          {/* Image Placeholder/Visual Container */}
                          <div className="size-20 rounded-lg bg-sky-50 dark:bg-sky-950/60 border flex items-center justify-center shrink-0">
                            {item.productImageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.productImageUrl}
                                alt={item.productName}
                                className="size-full object-contain p-1 rounded-lg"
                              />
                            ) : (
                              <ShoppingBag className="size-8 text-sky-800/40 dark:text-sky-300/40" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/product/${item.productSlug}`}
                              className="font-semibold text-foreground text-sm hover:underline line-clamp-2"
                            >
                              {item.productName}
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {item.color && (
                                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                                  Color: {item.color}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                Unit Price: {formatPrice(itemUnitPrice)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-8"
                              onClick={() => handleUpdateQty(item.id, item.quantity, -1, item.stockQuantity)}
                              disabled={item.quantity <= 1 || isBusy}
                            >
                              <Minus className="size-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-8"
                              onClick={() => handleUpdateQty(item.id, item.quantity, 1, item.stockQuantity)}
                              disabled={item.quantity >= item.stockQuantity || isBusy}
                            >
                              <Plus className="size-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>

                          {/* Item Subtotal & Delete */}
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-right min-w-[70px]">
                              {formatPrice(itemSubtotal)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 size-8"
                              onClick={() => handleRemoveItem(item.id, item.productName)}
                              disabled={isBusy}
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">Remove item</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Summary Card */}
              <div className="space-y-4">
                <Card className="border-border/60 shadow-xs">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                    <CardDescription>Estimated cost of your items & tax</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      {shippingFee === 0 ? (
                        <span className="font-medium text-emerald-700">Free</span>
                      ) : (
                        <span className="font-medium">{formatPrice(shippingFee)}</span>
                      )}
                    </div>

                    {shippingFee > 0 && (
                      <p className="text-[11px] text-muted-foreground/80 leading-3">
                        Add {formatPrice(shippingThreshold - subtotal)} more to qualify for Free Shipping!
                      </p>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST (18% Estimated)</span>
                      <span className="font-medium">{formatPrice(gstTax)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-base font-semibold">
                      <span>Total Amount</span>
                      <span className="text-sky-800 dark:text-sky-400">{formatPrice(grandTotal)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-3">
                    <Button
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="w-full bg-sky-700 hover:bg-sky-800 text-white py-6 font-medium shadow-xs"
                    >
                      {checkoutLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Checkout"
                      )}
                    </Button>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground justify-center">
                      <ShieldCheck className="size-3.5 text-emerald-700 shrink-0" />
                      100% Safe and Secure Checkout
                    </span>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react"
import { toast } from "sonner"

import { useCart } from "@/components/providers/cart-provider"
import { useCustomerAuth } from "@/components/providers/customer-auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { formatPrice } from "@/components/site/commerce-data"
import { type Address } from "@/app/account/addresses/page"

type BackendShippingMethod = {
  id: number
  name: string
  carrier: string
  baseRate: number
  calculatedRate: number
  minOrderValueForFreeShipping: number | null
  estimatedDeliveryDays: number
  isFree: boolean
}

type OrderPlacedDetails = {
  id: number
  orderNumber: string
  fullName: string
  streetAddress: string
  city: string
  state: string
  postalCode: string
  country: string
  shippingMethodName: string
  shippingCost: number
  subtotal: number
  tax: number
  totalAmount: number
  status: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useCustomerAuth()
  const { cart, isLoading: isCartLoading, clearCart } = useCart()

  // State Management
  const [addresses, setAddresses] = useState<Address[]>([])
  const [shippingMethods, setShippingMethods] = useState<BackendShippingMethod[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null)

  const [isAddressesLoading, setIsAddressesLoading] = useState(true)
  const [isShippingMethodsLoading, setIsShippingMethodsLoading] = useState(true)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<OrderPlacedDetails | null>(null)

  // Fetch addresses
  useEffect(() => {
    if (!user) return
    const fetchAddresses = async () => {
      try {
        setIsAddressesLoading(true)
        const res = await fetch("/api/addresses")
        if (res.ok) {
          const data = (await res.json()) as Address[]
          setAddresses(data)
          // Pre-select default address, otherwise first address
          const def = data.find((a) => a.isDefault)
          if (def) {
            setSelectedAddressId(def.id)
          } else if (data.length > 0) {
            setSelectedAddressId(data[0].id)
          }
        }
      } catch (err) {
        console.error("Error fetching addresses:", err)
      } finally {
        setIsAddressesLoading(false)
      }
    }
    fetchAddresses()
  }, [user])

  // Fetch shipping methods
  useEffect(() => {
    if (!cart || cart.items.length === 0) return
    const fetchShipping = async () => {
      try {
        setIsShippingMethodsLoading(true)
        const res = await fetch(`/api/shipping-methods?subtotal=${cart.subtotal}`)
        if (res.ok) {
          const data = (await res.json()) as BackendShippingMethod[]
          setShippingMethods(data)
          if (data.length > 0) {
            setSelectedMethodId(data[0].id)
          }
        }
      } catch (err) {
        console.error("Error fetching shipping options:", err)
      } finally {
        setIsShippingMethodsLoading(false)
      }
    }
    fetchShipping()
  }, [cart])

  // Redirect if not signed in or cart empty
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login?redirect=/checkout")
    }
  }, [user, isAuthLoading, router])

  const subtotal = cart?.subtotal ?? 0
  const selectedMethod = shippingMethods.find((m) => m.id === selectedMethodId)
  const shippingFee = selectedMethod?.calculatedRate ?? 0
  const gstTax = Math.round(subtotal * 0.18)
  const grandTotal = subtotal + shippingFee + gstTax

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.")
      return
    }
    if (!selectedMethodId) {
      toast.error("Please select a shipping method.")
      return
    }

    const addr = addresses.find((a) => a.id === selectedAddressId)
    if (!addr) {
      toast.error("Invalid address chosen.")
      return
    }

    try {
      setIsPlacingOrder(true)

      const orderItems = cart!.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSlug, // utilizing slug as SKU identifier placeholder
        productImageUrl: item.productImageUrl,
        price: item.salePrice ?? item.price,
        quantity: item.quantity,
        color: item.color,
      }))

      const payload = {
        fullName: addr.fullName,
        phoneNumber: addr.phoneNumber,
        streetAddress: addr.streetAddress,
        apartment: addr.apartment,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
        shippingMethodId: selectedMethodId,
        items: orderItems,
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const orderData = (await res.json()) as OrderPlacedDetails
        setPlacedOrder(orderData)
        // Empty customer cart
        await clearCart()
        toast.success("Order placed successfully!")
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to place order.")
      }
    } catch {
      toast.error("Network error while placing order. Please try again.")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const showLoading = isAuthLoading || (isCartLoading && !cart)

  if (showLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-sky-700" />
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (placedOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/10">
        <SiteHeader />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
          <Card className="border-border/60 shadow-lg text-center p-6 space-y-6">
            <div className="mx-auto size-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="size-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Thank you for your order!</h2>
              <p className="text-muted-foreground">
                Your order has been placed successfully. Order reference is{" "}
                <span className="font-mono font-bold text-sky-800">{placedOrder.orderNumber}</span>.
              </p>
            </div>

            <Separator />

            <div className="grid sm:grid-cols-2 gap-6 text-left text-sm max-w-md mx-auto py-2">
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Delivery Address:</span>
                <p className="font-medium text-foreground">{placedOrder.fullName}</p>
                <p className="text-muted-foreground">{placedOrder.streetAddress}</p>
                <p className="text-muted-foreground">
                  {placedOrder.city}, {placedOrder.state} {placedOrder.postalCode}
                </p>
                <p className="text-muted-foreground">{placedOrder.country}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Shipping Option:</span>
                <p className="font-medium text-foreground capitalize">{placedOrder.shippingMethodName}</p>
                <p className="text-muted-foreground">
                  Rate: {placedOrder.shippingCost === 0 ? "Free" : formatPrice(placedOrder.shippingCost)}
                </p>
                <span className="text-muted-foreground font-semibold block mt-4">Order Summary:</span>
                <div className="flex justify-between mt-1">
                  <span>Subtotal:</span>
                  <span>{formatPrice(placedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{placedOrder.shippingCost === 0 ? "Free" : formatPrice(placedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatPrice(placedOrder.tax)}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between font-bold text-sky-800">
                  <span>Paid Total:</span>
                  <span>{formatPrice(placedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="pt-2">
              <Button asChild className="bg-sky-700 hover:bg-sky-800 text-white px-8 py-6 font-semibold">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <div>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Return to Cart
            </Link>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground border-b pb-4">
            Secure Checkout
          </h1>

          {!cart || cart.items.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-2xl border shadow-sm max-w-md mx-auto my-8 p-8 space-y-6">
              <ShoppingBag className="size-16 text-sky-800/40 mx-auto" />
              <h3 className="text-2xl font-bold">Your cart is empty</h3>
              <Button asChild className="bg-sky-700 hover:bg-sky-800 text-white">
                <Link href="/products">Browse products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              {/* Checkout Steps */}
              <div className="space-y-6">
                {/* 1. Address Step */}
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="size-5 text-sky-700" />
                      1. Select Delivery Address
                    </CardTitle>
                    <CardDescription>Choose from your saved addresses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isAddressesLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="size-6 animate-spin text-sky-700" />
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-6 bg-muted/10 border border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground mb-4">You have no saved addresses yet.</p>
                        <Button asChild variant="outline">
                          <Link href="/account/addresses">Manage & Add Addresses</Link>
                        </Button>
                      </div>
                    ) : (
                      <RadioGroup
                        value={String(selectedAddressId)}
                        onValueChange={(val) => setSelectedAddressId(Number(val))}
                        className="grid gap-4 sm:grid-cols-2"
                      >
                        {addresses.map((addr) => (
                          <Label
                            key={addr.id}
                            htmlFor={`address-${addr.id}`}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/10 ${
                              selectedAddressId === addr.id
                                ? "border-sky-700 bg-sky-50/10"
                                : "border-border/60"
                            }`}
                          >
                            <RadioGroupItem
                              value={String(addr.id)}
                              id={`address-${addr.id}`}
                              className="mt-1 text-sky-700"
                            />
                            <div className="text-sm font-normal space-y-1">
                              <p className="font-semibold flex items-center gap-1.5 text-foreground">
                                {addr.fullName}
                                {addr.isDefault && (
                                  <span className="text-[10px] bg-sky-100 text-sky-800 font-medium px-1.5 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </p>
                              <p className="text-muted-foreground">{addr.streetAddress}</p>
                              {addr.apartment && <p className="text-muted-foreground">{addr.apartment}</p>}
                              <p className="text-muted-foreground">
                                {addr.city}, {addr.state} {addr.postalCode}
                              </p>
                              <p className="text-muted-foreground">{addr.country}</p>
                              <p className="text-xs text-muted-foreground pt-1.5 font-medium">
                                Tel: {addr.phoneNumber}
                              </p>
                            </div>
                          </Label>
                        ))}
                      </RadioGroup>
                    )}
                  </CardContent>
                </Card>

                {/* 2. Shipping configurations step */}
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Truck className="size-5 text-sky-700" />
                      2. Choose Shipping Method
                    </CardTitle>
                    <CardDescription>Select standard rates or priority express carrier rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isShippingMethodsLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="size-6 animate-spin text-sky-700" />
                      </div>
                    ) : shippingMethods.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No shipping configurations are currently available.</p>
                    ) : (
                      <RadioGroup
                        value={String(selectedMethodId)}
                        onValueChange={(val) => setSelectedMethodId(Number(val))}
                        className="grid gap-3"
                      >
                        {shippingMethods.map((method) => (
                          <Label
                            key={method.id}
                            htmlFor={`method-${method.id}`}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/10 ${
                              selectedMethodId === method.id
                                ? "border-sky-700 bg-sky-50/10"
                                : "border-border/60"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value={String(method.id)}
                                id={`method-${method.id}`}
                                className="text-sky-700"
                              />
                              <div className="text-sm font-normal">
                                <p className="font-semibold text-foreground">{method.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Carrier: {method.carrier} &bull; Delivery: {method.estimatedDeliveryDays}{" "}
                                  {method.estimatedDeliveryDays === 1 ? "day" : "days"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              {method.calculatedRate === 0 ? (
                                <span className="font-bold text-emerald-700 text-sm">Free</span>
                              ) : (
                                <span className="font-bold text-sm">{formatPrice(method.calculatedRate)}</span>
                              )}
                              {method.calculatedRate > 0 && method.minOrderValueForFreeShipping !== null && (
                                <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                                  Free above {formatPrice(method.minOrderValueForFreeShipping)}
                                </p>
                              )}
                            </div>
                          </Label>
                        ))}
                      </RadioGroup>
                    )}
                  </CardContent>
                </Card>

                {/* 3. Payment Option */}
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="size-5 text-sky-700" />
                      3. Select Payment Method
                    </CardTitle>
                    <CardDescription>All payments are securely processed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup defaultValue="cod" className="grid gap-3 sm:grid-cols-2">
                      <Label className="flex items-start gap-3 p-4 rounded-xl border border-sky-700 bg-sky-50/5 cursor-pointer">
                        <RadioGroupItem value="cod" id="payment-cod" className="mt-0.5 text-sky-700" />
                        <div className="text-sm font-normal">
                          <p className="font-semibold text-foreground">Cash on Delivery (COD)</p>
                          <p className="text-xs text-muted-foreground">
                            Pay in cash or UPI upon delivery.
                          </p>
                        </div>
                      </Label>
                      <Label className="flex items-start gap-3 p-4 rounded-xl border cursor-not-allowed opacity-50">
                        <RadioGroupItem value="card" id="payment-card" disabled className="mt-0.5" />
                        <div className="text-sm font-normal">
                          <p className="font-semibold text-foreground">Debit / Credit Card</p>
                          <p className="text-xs text-muted-foreground">
                            Temporarily unavailable for this storefront demo.
                          </p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              {/* Side Summary panel */}
              <div className="space-y-4">
                <Card className="border-border/60 shadow-xs sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Checkout Summary</CardTitle>
                    <CardDescription>Verify your order details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Item list scroll */}
                    <div className="max-h-48 overflow-y-auto pr-1 space-y-3">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex gap-2.5 items-center justify-between text-xs">
                          <div className="flex gap-2 items-center min-w-0">
                            <span className="size-6 text-[10px] rounded bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                              {item.quantity}x
                            </span>
                            <span className="truncate font-medium text-foreground">{item.productName}</span>
                          </div>
                          <span className="font-semibold">
                            {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      {isShippingMethodsLoading ? (
                        <Loader2 className="size-3 animate-spin text-muted-foreground" />
                      ) : shippingFee === 0 ? (
                        <span className="font-medium text-emerald-700">Free</span>
                      ) : (
                        <span className="font-medium">{formatPrice(shippingFee)}</span>
                      )}
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST (18% Estimated)</span>
                      <span className="font-medium">{formatPrice(gstTax)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-base font-semibold">
                      <span>Grand Total</span>
                      <span className="text-sky-800 dark:text-sky-400">{formatPrice(grandTotal)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-3">
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder || isShippingMethodsLoading || addresses.length === 0}
                      className="w-full bg-sky-700 hover:bg-sky-800 text-white py-6 font-semibold shadow-xs"
                    >
                      {isPlacingOrder ? (
                        <>
                          <Loader2 className="size-4 animate-spin mr-2" />
                          Placing Order...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground justify-center">
                      <ShieldCheck className="size-3.5 text-emerald-700 shrink-0" />
                      100% Secure Checkout Guarantee
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

"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Zap, Minus, Plus } from "lucide-react"
import { toast } from "sonner"

import { useCustomerAuth } from "@/components/providers/customer-auth-provider"
import { useCart } from "@/components/providers/cart-provider"
import { LoginPromptDialog } from "@/components/site/login-prompt-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type ProductActionsProps = {
  productId: number
  productName: string
  productSlug: string
  colors?: string[]
}

export function ProductActions({
  productId,
  productName,
  productSlug,
  colors = ["Graphite", "Silver", "Ocean"],
}: ProductActionsProps) {
  const router = useRouter()
  const { user } = useCustomerAuth()
  const { addToCart } = useCart()
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(colors[0].toLowerCase())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleAddToCart = async () => {
    if (!user) {
      setIsLoginPromptOpen(true)
      return
    }

    try {
      setIsSubmitting(true)
      const success = await addToCart(productId, quantity, selectedColor)
      if (success) {
        toast.success(`Added ${quantity}x ${productName} (${selectedColor}) to cart!`, {
          description: "Your cart has been updated.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBuyNow = async () => {
    if (!user) {
      setIsLoginPromptOpen(true)
      return
    }

    try {
      setIsSubmitting(true)
      const success = await addToCart(productId, quantity, selectedColor)
      if (success) {
        router.push("/cart")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <Label>Color</Label>
          <RadioGroup
            value={selectedColor}
            onValueChange={setSelectedColor}
            className="flex flex-wrap gap-2"
          >
            {colors.map((color) => (
              <Label
                key={color}
                className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm select-none hover:bg-muted/40 [&:has([data-state=checked])]:border-foreground"
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
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecreaseQuantity}
              disabled={quantity <= 1}
              type="button"
            >
              <Minus />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <Input
              className="w-16 text-center focus-visible:ring-0 select-none"
              value={quantity}
              readOnly
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncreaseQuantity}
              type="button"
            >
              <Plus />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 pt-2">
        <Button size="lg" onClick={handleAddToCart} disabled={isSubmitting}>
          <ShoppingCart className="size-5" />
          {isSubmitting ? "Adding..." : "Add to cart"}
        </Button>
        <Button size="lg" variant="secondary" onClick={handleBuyNow} disabled={isSubmitting}>
          <Zap className="size-5" />
          {isSubmitting ? "Processing..." : "Buy now"}
        </Button>
      </div>

      <LoginPromptDialog
        isOpen={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)}
      />
    </>
  )
}

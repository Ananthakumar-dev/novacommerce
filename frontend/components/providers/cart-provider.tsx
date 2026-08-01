"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { useCustomerAuth } from "@/components/providers/customer-auth-provider"

export type CartItem = {
  id: number
  productId: number
  productName: string
  productSlug: string
  productImageUrl: string | null
  price: number
  salePrice: number | null
  quantity: number
  color: string | null
  stockQuantity: number
}

export type CartResponse = {
  items: CartItem[]
  subtotal: number
  totalItems: number
}

type CartContextType = {
  cart: CartResponse | null
  isLoading: boolean
  addToCart: (productId: number, quantity: number, color: string | null) => Promise<boolean>
  updateQuantity: (itemId: number, quantity: number) => Promise<boolean>
  removeItem: (itemId: number) => Promise<boolean>
  clearCart: () => Promise<boolean>
  fetchCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useCustomerAuth()
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch("/api/cart")
      if (res.ok) {
        const data = await res.json()
        setCart(data)
      } else {
        setCart(null)
      }
    } catch (err) {
      console.error("Error fetching cart:", err)
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (productId: number, quantity: number, color: string | null) => {
    if (!user) {
      toast.error("Please sign in to add items to your cart.")
      return false
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, color }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to add item to cart.")
        return false
      }

      setCart(data)
      return true
    } catch {
      toast.error("Network error occurred. Please try again.")
      return false
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!user) return false

    try {
      const res = await fetch(`/api/cart/${itemId}?quantity=${quantity}`, {
        method: "PUT",
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to update quantity.")
        return false
      }

      setCart(data)
      return true
    } catch {
      toast.error("Network error occurred. Please try again.")
      return false
    }
  }

  const removeItem = async (itemId: number) => {
    if (!user) return false

    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to remove item from cart.")
        return false
      }

      setCart(data)
      return true
    } catch {
      toast.error("Network error occurred. Please try again.")
      return false
    }
  }

  const clearCart = async () => {
    if (!user) return false

    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
      })

      if (!res.ok) {
        toast.error("Failed to clear cart.")
        return false
      }

      setCart(null)
      return true
    } catch {
      toast.error("Network error occurred. Please try again.")
      return false
    }
  }

  return (
    <CartContext.Provider value={{ cart, isLoading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

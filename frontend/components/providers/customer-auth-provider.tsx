"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

export type CustomerUser = {
  id?: number
  email: string
  fullName: string
  role: string
}

type CustomerAuthContextType = {
  user: CustomerUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined)

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user || null)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, message: data.message || "Login failed." }
      }

      setUser(data.user)
      router.refresh()
      return { success: true }
    } catch {
      return { success: false, message: "Network error occurred during login." }
    }
  }

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, message: data.message || "Registration failed." }
      }

      setUser(data.user)
      router.refresh()
      return { success: true }
    } catch {
      return { success: false, message: "Network error occurred during registration." }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      setUser(null)
      router.refresh()
    }
  }

  return (
    <CustomerAuthContext.Provider
      value={{ user, isLoading, login, register, logout, refreshUser }}
    >
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext)
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider")
  }
  return context
}

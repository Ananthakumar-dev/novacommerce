"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Mail, Shield, ShoppingBag, LogOut, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"

import { useCustomerAuth } from "@/components/providers/customer-auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export default function AccountPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useCustomerAuth()

  const getInitials = (name?: string) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <Loader2 className="size-5 animate-spin text-sky-700" />
            Loading account details...
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-md shadow-lg border-border/60 text-center p-6 space-y-4">
            <div className="mx-auto size-12 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center">
              <User className="size-6" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl">Authentication Required</CardTitle>
              <CardDescription>You need to sign in to access your account profile.</CardDescription>
            </div>
            <Button asChild className="w-full bg-sky-700 hover:bg-sky-800 text-white font-medium">
              <Link href="/login?redirect=/account">Sign In Now</Link>
            </Button>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <SiteHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Store Front
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <h1 className="text-xl font-bold tracking-tight text-foreground">My Account</h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await logout()
              router.push("/")
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 gap-1.5"
          >
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </div>

        {/* User Banner */}
        <Card className="border-border/60 shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-sky-700 to-indigo-800 p-6 flex items-end">
            <div className="translate-y-8 flex items-center gap-4">
              <Avatar className="size-20 border-4 border-background shadow-md">
                <AvatarFallback className="text-xl font-bold bg-sky-100 text-sky-900">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="pt-10 px-6 pb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">{user.fullName}</h2>
                  <Badge variant="secondary" className="bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    {user.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link href="/orders">
                    <ShoppingBag className="size-4 text-sky-700" />
                    My Orders
                  </Link>
                </Button>
              </div>
            </div>

            <Separator />

            {/* Profile Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-border/40 bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <User className="size-4 text-sky-700" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Full Name</span>
                    <span className="font-medium">{user.fullName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Account Status</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="size-3.5" /> Active
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Shield className="size-4 text-sky-700" />
                    Security & Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Auth Token Cookie</span>
                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">nova_customer_token</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Assigned Role</span>
                    <span className="font-medium">{user.role}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Backend Service</span>
                    <span className="font-medium text-sky-700">Spring Boot Auth Service</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </main>

      <SiteFooter />
    </div>
  )
}

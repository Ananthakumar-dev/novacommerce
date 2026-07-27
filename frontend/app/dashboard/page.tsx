"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  Heart,
  Package,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Truck,
  Clock,
  ExternalLink,
  Users,
  Settings,
  Store,
  Layers,
  Inbox
} from "lucide-react"

import { useCustomerAuth } from "@/components/providers/customer-auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useCustomerAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock Customer Data
  const customerStats = [
    { title: "Active Orders", value: "2", description: "Currently in transit", icon: Truck, color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40" },
    { title: "Cart Items", value: "3", description: "Items in your cart", icon: ShoppingCart, color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40" },
    { title: "Total Spending", value: "$482.90", description: "All-time purchase volume", icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40" },
    { title: "Saved Items", value: "12", description: "Your wishlist count", icon: Heart, color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40" }
  ]

  const customerOrders = [
    { id: "ORD-8942", date: "July 24, 2026", items: "Winter Jacket, Wool Scarf", total: "$124.50", status: "Shipped", icon: Truck, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
    { id: "ORD-8711", date: "July 12, 2026", items: "Leather Sneakers", total: "$89.00", status: "Delivered", icon: CheckCircle, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300" },
    { id: "ORD-8605", date: "June 28, 2026", items: "Wireless Headphones, Tech Pack", total: "$269.40", status: "Delivered", icon: CheckCircle, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300" }
  ]

  // Mock Merchant Data
  const merchantStats = [
    { title: "Active Products", value: "48", description: "Listed on storefront", icon: Package, color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40" },
    { title: "Pending Orders", value: "8", description: "Awaiting fulfillment", icon: ClipboardList, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40" },
    { title: "Monthly Sales", value: "$14,850.00", description: "+18% from last month", icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40" },
    { title: "Low Stock Items", value: "4", description: "Requires replenishment", icon: AlertTriangle, color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40" }
  ]

  const merchantOrders = [
    { id: "ORD-9022", customer: "Alice Vance", date: "Today, 10:45 AM", items: "3 items", total: "$184.00", status: "Pending", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300" },
    { id: "ORD-8994", customer: "Bob Sterling", date: "Yesterday", items: "1 item", total: "$45.00", status: "Processing", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
    { id: "ORD-8910", customer: "Claire Redfield", date: "July 23, 2026", items: "2 items", total: "$320.00", status: "Completed", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300" }
  ]

  const lowStockProducts = [
    { name: "Nova Fleece Jacket", sku: "JAC-FLC-MD", stock: 2, price: "$79.00" },
    { name: "Ergonomic Office Chair", sku: "CHR-ERG-BLK", stock: 1, price: "$249.00" },
    { name: "Sports Water Bottle", sku: "BTL-SPT-BLU", stock: 0, price: "$18.00" },
    { name: "Eco Cotton Socks", sku: "SOK-COT-WHT", stock: 3, price: "$12.00" }
  ]

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/dashboard")
    }
  }, [isLoading, user, router])

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
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-sky-700" />
            <span className="text-sm font-medium">Preparing your workspace...</span>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  const isMerchant = user.role === "MERCHANT"

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-border/60 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 border-2 border-primary/10 shadow-xs">
              <AvatarFallback className="text-lg font-bold bg-sky-50 text-sky-950 dark:bg-sky-950 dark:text-sky-300">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, {user.fullName}!</h1>
                <Badge className={isMerchant ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-none font-semibold" : "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-none font-semibold"}>
                  {user.role}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isMerchant 
                  ? "Here's the current health and operation statistics of your store."
                  : "Keep track of your purchases, deliveries, and profile details here."
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="gap-1.5 hover:bg-muted">
              <Link href="/account">
                <Settings className="size-4" />
                Account Details
              </Link>
            </Button>
          </div>
        </div>

        {/* Dashboard Grid - Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(isMerchant ? merchantStats : customerStats).map((stat, idx) => (
            <Card 
              key={stat.title} 
              className="hover:shadow-md transition-all hover:border-sky-500/20 group animate-in fade-in slide-in-from-bottom-3 duration-500"
              style={{ animationDelay: `${idx * 75}ms`, animationFillMode: "both" }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                  <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 duration-300 ${stat.color}`}>
                    <stat.icon className="size-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-extrabold tracking-tight text-foreground">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dynamic Content Columns */}
        {isMerchant ? (
          /* MERCHANT DASHBOARD UI */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Recent Orders to Fulfill */}
            <Card className="lg:col-span-2 border-border/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-bold">Orders Pending Fulfillment</CardTitle>
                  <CardDescription>Recent customer purchases requiring action.</CardDescription>
                </div>
                <Badge variant="outline" className="border-sky-700/20 text-sky-700 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/20">
                  Fulfillment View
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {merchantOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                          <TableCell className="font-mono font-semibold text-sky-700 dark:text-sky-400">{order.id}</TableCell>
                          <TableCell className="font-medium">{order.customer}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{order.date}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell className="font-medium text-foreground">{order.total}</TableCell>
                          <TableCell className="text-right">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${order.color}`}>
                              {order.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Side Column: Inventory & Low Stock Alerts */}
            <div className="space-y-6">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <AlertTriangle className="size-5 text-rose-500 animate-pulse" />
                    Low Stock Alerts
                  </CardTitle>
                  <CardDescription>Products running out. Replenish soon.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lowStockProducts.map((prod) => (
                    <div key={prod.sku} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 hover:bg-muted/60 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">{prod.name}</p>
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">{prod.sku}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                          prod.stock === 0 
                            ? "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                        }`}>
                          {prod.stock === 0 ? "Out of Stock" : `${prod.stock} Left`}
                        </span>
                        <p className="text-xs font-medium text-foreground mt-1">{prod.price}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                    <Link href="/admin/inventory" className="gap-1 flex justify-center items-center">
                      Manage Inventory
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions Panel */}
              <Card className="border-border/60 shadow-sm bg-gradient-to-br from-white to-sky-50/20 dark:from-zinc-900 dark:to-zinc-950">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                  <CardDescription>Common operations tasks.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto gap-2 text-center hover:bg-sky-500/5 hover:border-sky-500/20 transition-all" asChild>
                    <Link href="/admin/products">
                      <Store className="size-5 text-sky-700" />
                      <span className="text-xs font-semibold">Catalog</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center p-6 h-auto gap-2 text-center hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all" asChild>
                    <Link href="/admin/categories">
                      <Layers className="size-5 text-indigo-700" />
                      <span className="text-xs font-semibold">Categories</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="col-span-2 py-3 justify-between hover:bg-muted/50" asChild>
                    <Link href="/account">
                      <span className="text-xs font-semibold">Verify Merchant Credentials</span>
                      <ExternalLink className="size-3.5 text-muted-foreground" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* CUSTOMER DASHBOARD UI */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Recent Purchases List */}
            <Card className="lg:col-span-2 border-border/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-bold">My Recent Orders</CardTitle>
                  <CardDescription>View, track, or reorder your recent items.</CardDescription>
                </div>
                <ShoppingBag className="size-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerOrders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/60 hover:border-sky-500/20 hover:bg-muted/10 transition-all gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 mt-0.5">
                          <order.icon className="size-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{order.id}</span>
                            <span className="text-xs text-muted-foreground">{order.date}</span>
                          </div>
                          <p className="text-sm font-medium text-foreground/80 mt-1">{order.items}</p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col justify-between sm:items-end gap-2 items-center sm:text-right shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${order.color}`}>
                          {order.status}
                        </span>
                        <div className="font-bold text-foreground text-sm sm:mt-1">{order.total}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 hover:bg-muted" asChild>
                  <Link href="/orders" className="gap-1.5 flex justify-center items-center">
                    View All Orders
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Side Column: Shopping Assistant & Wishlist Preview */}
            <div className="space-y-6">
              {/* Wishlist Preview */}
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Heart className="size-5 text-rose-500" />
                    Saved Items Preview
                  </CardTitle>
                  <CardDescription>Recent items you marked as favorite.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Premium Leather Chelsea Boots", price: "$189.00", inStock: true },
                    { name: "Minimalist Mechanical Keyboard", price: "$120.00", inStock: false },
                    { name: "Tech Backpack Waterproof", price: "$75.00", inStock: true }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.price}</p>
                      </div>
                      <div className="shrink-0 ml-2">
                        {item.inStock ? (
                          <Button size="sm" variant="outline" className="text-xs bg-sky-50 text-sky-700 border-sky-700/20 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300">Add to Cart</Button>
                        ) : (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Sold Out</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full text-sky-700 hover:text-sky-800 p-0 text-xs font-semibold mt-2">
                    Manage Wishlist (12 items)
                  </Button>
                </CardContent>
              </Card>

              {/* Shopping Banner */}
              <Card className="border-border/60 shadow-sm overflow-hidden relative bg-gradient-to-br from-sky-700 to-indigo-850 text-white p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.15),transparent_40%)] pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <Badge className="bg-white/25 text-white border-none hover:bg-white/30 text-[10px] uppercase font-bold tracking-wider mb-2">Member Perk</Badge>
                    <h4 className="text-lg font-bold leading-tight mt-1">Get 10% Off on your next order!</h4>
                    <p className="text-xs text-sky-100 mt-2">Use discount code <span className="font-mono font-bold bg-white/20 px-1 py-0.5 rounded text-white">NOVASUMMER</span> at checkout.</p>
                  </div>
                  <Button variant="secondary" size="sm" className="mt-5 w-fit bg-white text-sky-950 font-semibold hover:bg-sky-50" asChild>
                    <Link href="/products" className="gap-1 items-center flex">
                      Browse Store
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

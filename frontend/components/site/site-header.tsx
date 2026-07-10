"use client"

import Link from "next/link"
import { Menu, Search, ShoppingCart, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = ["Deals", "Categories", "Orders", "Support"]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>NovaCommerce</SheetTitle>
            </SheetHeader>
            <nav className="grid gap-1 px-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href="/"
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="shrink-0">
          <span className="text-lg font-semibold tracking-tight">
            Nova<span className="text-sky-700">Commerce</span>
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-lg border bg-muted/30 p-1 md:flex">
          <Select defaultValue="all">
            <SelectTrigger className="w-36 border-0 bg-transparent shadow-none">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="mobiles">Mobiles</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="home">Home</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for products, brands and more"
              className="border-0 bg-transparent pl-8 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button>Search</Button>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.slice(0, 3).map((item) => (
            <Button key={item} variant="ghost" asChild>
              <Link href="/">{item}</Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserRound />
                <span className="sr-only">Account</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Account</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <ShoppingCart />
                <span className="sr-only">Cart</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cart</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="border-t px-4 py-2 md:hidden">
        <div className="relative mx-auto max-w-7xl">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products" className="pl-8" />
        </div>
      </div>
    </header>
  )
}

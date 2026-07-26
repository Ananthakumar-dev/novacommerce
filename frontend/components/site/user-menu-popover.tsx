"use client"

import React, { useState } from "react"
import Link from "next/link"
import { LogIn, UserPlus, User, ShoppingBag, LogOut, ShieldCheck, ChevronRight } from "lucide-react"

import { useCustomerAuth } from "@/components/providers/customer-auth-provider"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function UserMenuPopover() {
  const { user, isLoading, logout } = useCustomerAuth()
  const [open, setOpen] = useState(false)

  const getInitials = (name?: string) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-muted focus-visible:ring-1"
          aria-label="User Account"
        >
          {user ? (
            <Avatar className="size-8 transition-transform hover:scale-105">
              <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
            </Avatar>
          ) : (
            <User className="size-5 text-muted-foreground hover:text-foreground" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 shadow-xl rounded-xl border border-border/60" align="end" sideOffset={8}>
        {isLoading ? (
          <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">
            Loading profile...
          </div>
        ) : user ? (
          <div className="flex flex-col">
            {/* User Profile Header */}
            <div className="p-4 bg-muted/40 rounded-t-xl flex items-center gap-3">
              <Avatar className="size-11 border border-background shadow-xs">
                <AvatarFallback className="text-sm font-bold">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm truncate text-foreground">
                    {user.fullName}
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-medium bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    {user.role}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Menu Options */}
            <div className="p-2 space-y-0.5">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-accent text-foreground transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <User className="size-4 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                  <span>Account Overview</span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/orders"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-accent text-foreground transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="size-4 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                  <span>My Orders</span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {user.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="size-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span>Admin Control Panel</span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>

            <Separator className="bg-border/50" />

            {/* Logout Action */}
            <div className="p-2 bg-muted/20 rounded-b-xl">
              <Button
                variant="ghost"
                onClick={async () => {
                  setOpen(false)
                  await logout()
                }}
                className="w-full justify-start gap-2.5 text-red-600 hover:text-red-700 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-950/40 text-sm font-medium h-9"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">Welcome to NovaCommerce</h4>
              <p className="text-xs text-muted-foreground">
                Sign in or register to track orders, save items, and manage your account.
              </p>
            </div>

            <div className="grid gap-2">
              <Button
                asChild
                className="w-full justify-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-medium shadow-xs"
                onClick={() => setOpen(false)}
              >
                <Link href="/login">
                  <LogIn className="size-4" />
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-center gap-2 font-medium"
                onClick={() => setOpen(false)}
              >
                <Link href="/register">
                  <UserPlus className="size-4 text-sky-700" />
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

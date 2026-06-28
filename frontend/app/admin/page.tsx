import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Store,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  title: "Admin Login | NovaCommerce",
  description: "Sign in to the NovaCommerce admin panel.",
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r bg-zinc-950 text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(140deg,rgba(255,255,255,0.08),transparent_38%)]" />
          <div className="relative flex w-full flex-col justify-between p-10 xl:p-12">
            <Link
              href="/admin"
              className="flex w-fit items-center gap-3 text-sm font-medium"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-white text-zinc-950">
                <Store className="size-4" aria-hidden="true" />
              </span>
              <span>NovaCommerce Admin</span>
            </Link>

            <div className="max-w-xl space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Operations console
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-balance xl:text-5xl">
                  Manage orders, products, and store activity from one secure
                  workspace.
                </h1>
                <p className="max-w-lg text-base leading-7 text-zinc-300">
                  Built for store teams who need a calm, focused view of daily
                  ecommerce work.
                </p>
              </div>

              <div className="grid max-w-lg grid-cols-3 gap-3">
                {[
                  ["24/7", "Order view"],
                  ["Live", "Catalog tools"],
                  ["Secure", "Staff access"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <div className="text-lg font-semibold">{value}</div>
                    <div className="mt-1 text-xs text-zinc-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Admin access is monitored and protected.
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[420px]">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Store className="size-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold">NovaCommerce Admin</span>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-7 space-y-2">
                <div className="flex size-10 items-center justify-center rounded-lg border bg-muted">
                  <LockKeyhole
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Sign in to admin
                  </h1>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Use your staff account to access the NovaCommerce control
                    panel.
                  </p>
                </div>
              </div>

              <form className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@novacommerce.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <LockKeyhole
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="h-10 w-full">
                  Sign in
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Button>
              </form>

              <div className="mt-6 flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                <BadgeCheck
                  className="mt-0.5 size-4 shrink-0 text-foreground"
                  aria-hidden="true"
                />
                <p>
                  This area is for authorized NovaCommerce staff only. Backend
                  authentication will be connected in a later phase.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

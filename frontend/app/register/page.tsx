"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, UserPlus, Lock, Mail, User, ArrowLeft, Loader2 } from "lucide-react"

import { useCustomerAuth } from "@/components/providers/customer-auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useCustomerAuth()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill out all fields.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const result = await register(fullName, email, password)
      if (!result.success) {
        setError(result.message || "Registration failed. Please try again.")
        setLoading(false)
      } else {
        router.push("/")
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to store
          </Link>

          <Card className="shadow-lg border-border/60">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto size-12 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center mb-2">
                <UserPlus className="size-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
              <CardDescription>
                Join NovaCommerce to track orders & manage your profile
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-xs rounded-lg bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-700 hover:bg-sky-800 text-white font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-sky-700 hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

"use client"

import React, { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  User,
  Phone,
  Home,
  AlertTriangle
} from "lucide-react"
import { toast } from "sonner"

import { useCustomerAuth } from "@/components/providers/customer-auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type Address = {
  id: number
  fullName: string
  phoneNumber: string
  streetAddress: string
  apartment?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt?: string
  updatedAt?: string
}

const COUNTRIES = [
  { value: "United States", label: "United States" },
  { value: "Canada", label: "Canada" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "India", label: "India" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Japan", label: "Japan" },
  { value: "Singapore", label: "Singapore" },
]

export default function AddressesPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useCustomerAuth()
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null)

  // Form State
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [streetAddress, setStreetAddress] = useState("")
  const [apartment, setApartment] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("")
  const [isDefault, setIsDefault] = useState(false)

  // Reset form helper
  const resetForm = useCallback(() => {
    setFullName("")
    setPhoneNumber("")
    setStreetAddress("")
    setApartment("")
    setCity("")
    setState("")
    setPostalCode("")
    setCountry("United States")
    setIsDefault(false)
    setEditingAddress(null)
  }, [])

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/addresses")
      if (res.ok) {
        const data = await res.json()
        setAddresses(data)
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to load addresses")
      }
    } catch {
      toast.error("Network error while loading addresses")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user, fetchAddresses])

  // Open sheet for add
  const handleAddClick = () => {
    resetForm()
    setIsSheetOpen(true)
  }

  // Open sheet for edit
  const handleEditClick = (address: Address) => {
    setEditingAddress(address)
    setFullName(address.fullName)
    setPhoneNumber(address.phoneNumber)
    setStreetAddress(address.streetAddress)
    setApartment(address.apartment || "")
    setCity(address.city)
    setState(address.state)
    setPostalCode(address.postalCode)
    setCountry(address.country)
    setIsDefault(address.isDefault)
    setIsSheetOpen(true)
  }

  // Set default address
  const handleSetDefault = async (addressId: number) => {
    try {
      const res = await fetch(`/api/addresses/${addressId}/default`, {
        method: "PATCH",
      })

      if (res.ok) {
        toast.success("Default address updated successfully")
        fetchAddresses()
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to set default address")
      }
    } catch {
      toast.error("Network error. Please try again.")
    }
  }

  // Delete address
  const handleDeleteAddress = async () => {
    if (!addressToDelete) return
    try {
      const res = await fetch(`/api/addresses/${addressToDelete.id}`, {
        method: "DELETE",
      })

      if (res.status === 204 || res.ok) {
        toast.success("Address deleted successfully")
        setAddressToDelete(null)
        fetchAddresses()
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to delete address")
      }
    } catch {
      toast.error("Network error. Please try again.")
    }
  }

  // Submit address form (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !phoneNumber || !streetAddress || !city || !state || !postalCode || !country) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        fullName,
        phoneNumber,
        streetAddress,
        apartment: apartment || undefined,
        city,
        state,
        postalCode,
        country,
        isDefault,
      }

      const url = editingAddress ? `/api/addresses/${editingAddress.id}` : "/api/addresses"
      const method = editingAddress ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(
          editingAddress ? "Address updated successfully" : "Address added successfully"
        )
        setIsSheetOpen(false)
        resetForm()
        fetchAddresses()
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to save address")
      }
    } catch {
      toast.error("Network error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <Loader2 className="size-5 animate-spin text-sky-700" />
            Verifying authentication...
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
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl">Authentication Required</CardTitle>
              <CardDescription>You need to sign in to manage your addresses.</CardDescription>
            </div>
            <Button asChild className="w-full bg-sky-700 hover:bg-sky-800 text-white font-medium">
              <Link href="/login?redirect=/account/addresses">Sign In Now</Link>
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

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/account" className="hover:text-foreground transition-colors flex items-center gap-1">
                <ArrowLeft className="size-3.5" />
                My Account
              </Link>
              <span className="text-muted-foreground/35">/</span>
              <span className="text-foreground">Addresses</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Address Book</h1>
            <p className="text-sm text-muted-foreground">
              Manage your delivery addresses. The default address will be pre-selected during checkout.
            </p>
          </div>

          <Button
            onClick={handleAddClick}
            className="bg-sky-700 hover:bg-sky-800 text-white flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="size-4" />
            Add New Address
          </Button>
        </div>

        <Separator />

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="border-border/60 shadow-xs h-[200px] flex flex-col justify-between">
                <CardHeader className="space-y-2">
                  <div className="h-5 w-1/3 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent className="h-10 bg-muted/50 rounded mx-6 animate-pulse" />
                <CardFooter className="bg-muted/10 h-12 animate-pulse" />
              </Card>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <Card className="border-border/60 shadow-xs py-12 px-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="size-16 rounded-full bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-700 dark:text-sky-400">
              <MapPin className="size-8" />
            </div>
            <div className="space-y-1 max-w-sm">
              <CardTitle className="text-lg">No Saved Addresses</CardTitle>
              <CardDescription>
                You haven't saved any addresses yet. Add a shipping address to enjoy a faster checkout process.
              </CardDescription>
            </div>
            <Button onClick={handleAddClick} className="bg-sky-700 hover:bg-sky-800 text-white gap-1.5">
              <Plus className="size-4" />
              Add First Address
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className={`border shadow-xs flex flex-col justify-between overflow-hidden transition-all duration-200 ${
                  address.isDefault
                    ? "border-sky-600 ring-1 ring-sky-600 bg-sky-50/5 dark:bg-sky-950/5"
                    : "border-border/60"
                }`}
              >
                <CardHeader className="pb-3 flex flex-row items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <User className="size-3.5 text-muted-foreground" />
                        {address.fullName}
                      </span>
                      {address.isDefault && (
                        <Badge className="bg-sky-600 hover:bg-sky-600 text-white py-0.5 px-1.5 text-[10px] font-medium tracking-wide">
                          Default Address
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Phone className="size-3.5 text-muted-foreground" />
                      {address.phoneNumber}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="text-sm space-y-1 pb-4 text-foreground/80 flex-1">
                  <div className="flex gap-1.5">
                    <Home className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                    <div>
                      <p>{address.streetAddress}</p>
                      {address.apartment && <p className="text-muted-foreground text-xs">{address.apartment}</p>}
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="font-medium text-xs text-muted-foreground uppercase mt-0.5">{address.country}</p>
                    </div>
                  </div>
                </CardContent>

                <Separator />

                <CardFooter className="bg-muted/10 px-6 py-3 flex items-center justify-between text-xs gap-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(address)}
                      className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1.5"
                    >
                      <Edit2 className="size-3.5 text-sky-700" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddressToDelete(address)}
                      className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 px-2 gap-1.5"
                    >
                      <Trash2 className="size-3.5 text-red-500" />
                      Delete
                    </Button>
                  </div>

                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="border-sky-700/30 text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/20 h-8 gap-1"
                    >
                      <Check className="size-3.5" />
                      Set Default
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Slide-over Address Form Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>{editingAddress ? "Edit Shipping Address" : "Add New Address"}</SheetTitle>
            <SheetDescription>
              {editingAddress
                ? "Update your contact and address information below."
                : "Fill out the fields to register a new shipping address."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 px-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="required">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                placeholder="123 Main St"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apartment">Apartment, Suite, Unit, etc. (Optional)</Label>
              <Input
                id="apartment"
                placeholder="Apt 4B"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="state">State / Region</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="postalCode">Postal / ZIP Code</Label>
                <Input
                  id="postalCode"
                  placeholder="10001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="isDefault"
                type="checkbox"
                checked={isDefault}
                disabled={addresses.length === 0 || (editingAddress?.isDefault ?? false)}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded border-input text-sky-700 focus:ring-sky-700/50 size-4 cursor-pointer disabled:cursor-not-allowed"
              />
              <Label
                htmlFor="isDefault"
                className="text-xs font-normal text-muted-foreground cursor-pointer select-none"
              >
                {addresses.length === 0
                  ? "First address will be marked as default automatically"
                  : "Set as my default shipping address"}
              </Label>
            </div>

            <SheetFooter className="pt-6 flex flex-row gap-3">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-sky-700 hover:bg-sky-800 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Address"
                )}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!addressToDelete} onOpenChange={(open) => !open && setAddressToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the address for{" "}
              <strong className="text-foreground">{addressToDelete?.fullName}</strong> (
              {addressToDelete?.streetAddress}, {addressToDelete?.city}) from your profile.
              {addressToDelete?.isDefault && addresses.length > 1 && (
                <span className="block mt-2 text-amber-600 font-medium">
                  Note: Since this is your default address, another saved address will automatically be selected as default.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAddress}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Address
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SiteFooter />
    </div>
  )
}

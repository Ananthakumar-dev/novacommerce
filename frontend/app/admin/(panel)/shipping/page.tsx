"use client"

import React, { useEffect, useState } from "react"
import { Edit2, Loader2, Plus, Trash2, Truck } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import type { AdminShippingMethod } from "@/lib/admin-shipping"
import { listShippingMethodsAction, deleteShippingMethodAction } from "./actions"
import { formatPrice } from "@/components/site/commerce-data"
import { ShippingFormSheet } from "./shipping-form-sheet"

export default function ShippingAdminPage() {
  const [methods, setMethods] = useState<AdminShippingMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<AdminShippingMethod | null>(null)
  const [deletingMethod, setDeletingMethod] = useState<AdminShippingMethod | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchMethods = async () => {
    try {
      setIsLoading(true)
      const data = await listShippingMethodsAction()
      setMethods(data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load shipping configurations.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMethods()
  }, [])

  const handleAddClick = () => {
    setEditingMethod(null)
    setIsSheetOpen(true)
  }

  const handleEditClick = (method: AdminShippingMethod) => {
    setEditingMethod(method)
    setIsSheetOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingMethod) return

    try {
      setIsDeleting(true)
      await deleteShippingMethodAction(deletingMethod.id)
      toast.success(`Removed ${deletingMethod.name} shipping method.`)
      setDeletingMethod(null)
      fetchMethods()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to remove shipping configuration.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <Card className="border-border/60">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Truck className="size-6 text-sky-700" />
                Shipping Configurations
              </CardTitle>
              <CardDescription>
                Configure carriers, rates, delivery timelines, and free shipping thresholds.
              </CardDescription>
            </div>
            <div>
              <Button onClick={handleAddClick} className="bg-sky-700 hover:bg-sky-800 text-white font-medium">
                <Plus className="size-4 mr-2" />
                Add Shipping Method
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="size-8 animate-spin text-sky-700" />
              </div>
            ) : methods.length ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Shipping Option</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Base Rate</TableHead>
                      <TableHead>Free Shipping Threshold</TableHead>
                      <TableHead>Delivery Est.</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {methods.map((method) => (
                      <TableRow key={method.id} className="hover:bg-muted/10 transition-colors">
                        <TableCell className="font-semibold text-foreground">
                          {method.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {method.carrier}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {formatPrice(method.baseRate)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {method.minOrderValueForFreeShipping !== null ? (
                            <span className="inline-flex items-center text-emerald-700 font-medium">
                              Free above {formatPrice(method.minOrderValueForFreeShipping)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {method.estimatedDeliveryDays} {method.estimatedDeliveryDays === 1 ? "day" : "days"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={method.active ? "secondary" : "outline"} className={method.active ? "bg-sky-50 text-sky-700 border-sky-200" : ""}>
                            {method.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(method)}
                              className="size-8 text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="size-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingMethod(method)}
                              className="size-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center bg-muted/10">
                <span className="flex size-12 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950/60 border">
                  <Truck className="size-6 text-sky-800" />
                </span>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">No shipping configurations</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Configure a shipping option to calculate delivery fees for storefront customer checkout.
                  </p>
                </div>
                <Button onClick={handleAddClick} className="mt-2 bg-sky-700 hover:bg-sky-800 text-white">
                  Add Shipping Method
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ShippingFormSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSuccess={fetchMethods}
        editingMethod={editingMethod}
      />

      <AlertDialog open={deletingMethod !== null} onOpenChange={(open) => !open && setDeletingMethod(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the shipping option <strong>{deletingMethod?.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteConfirm()
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Method"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}

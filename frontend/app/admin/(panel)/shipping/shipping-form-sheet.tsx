"use client"

import React, { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import type { AdminShippingMethod } from "@/lib/admin-shipping"
import { createShippingMethodAction, updateShippingMethodAction } from "./actions"

type ShippingFormSheetProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editingMethod: AdminShippingMethod | null
}

export function ShippingFormSheet({
  isOpen,
  onOpenChange,
  onSuccess,
  editingMethod,
}: ShippingFormSheetProps) {
  const [name, setName] = useState("")
  const [carrier, setCarrier] = useState("")
  const [baseRate, setBaseRate] = useState("")
  const [minOrderValueForFreeShipping, setMinOrderValueForFreeShipping] = useState("")
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState("")
  const [active, setActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingMethod) {
      setName(editingMethod.name)
      setCarrier(editingMethod.carrier)
      setBaseRate(String(editingMethod.baseRate))
      setMinOrderValueForFreeShipping(
        editingMethod.minOrderValueForFreeShipping !== null
          ? String(editingMethod.minOrderValueForFreeShipping)
          : ""
      )
      setEstimatedDeliveryDays(String(editingMethod.estimatedDeliveryDays))
      setActive(editingMethod.active)
    } else {
      setName("")
      setCarrier("")
      setBaseRate("")
      setMinOrderValueForFreeShipping("")
      setEstimatedDeliveryDays("")
      setActive(true)
    }
  }, [editingMethod, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !carrier || !baseRate || !estimatedDeliveryDays) {
      toast.error("Please fill in all required fields.")
      return
    }

    const rateNum = parseFloat(baseRate)
    const daysNum = parseInt(estimatedDeliveryDays, 10)
    const thresholdNum = minOrderValueForFreeShipping ? parseFloat(minOrderValueForFreeShipping) : null

    if (isNaN(rateNum) || rateNum < 0) {
      toast.error("Please enter a valid base rate.")
      return
    }

    if (isNaN(daysNum) || daysNum < 1) {
      toast.error("Please enter a valid delivery time in days.")
      return
    }

    if (thresholdNum !== null && (isNaN(thresholdNum) || thresholdNum < 0)) {
      toast.error("Please enter a valid free shipping threshold.")
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        name,
        carrier,
        baseRate: rateNum,
        minOrderValueForFreeShipping: thresholdNum,
        estimatedDeliveryDays: daysNum,
        active,
      }

      if (editingMethod) {
        await updateShippingMethodAction(editingMethod.id, payload)
        toast.success("Shipping method updated successfully.")
      } else {
        await createShippingMethodAction(payload)
        toast.success("Shipping method created successfully.")
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to save shipping configuration.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[480px]">
        <SheetHeader>
          <SheetTitle>{editingMethod ? "Edit Shipping Method" : "Add Shipping Method"}</SheetTitle>
          <SheetDescription>
            {editingMethod
              ? "Modify the configurations for this delivery option."
              : "Fill out the fields to register a new shipping configuration."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-6">
          <div className="space-y-2">
            <Label htmlFor="name">Method Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Standard Ground, Express Delivery"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrier">Carrier *</Label>
            <Input
              id="carrier"
              placeholder="e.g. FedEx, DHL, USPS, Local Delivery"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseRate">Base Rate (INR) *</Label>
              <Input
                id="baseRate"
                type="number"
                step="0.01"
                placeholder="150"
                value={baseRate}
                onChange={(e) => setBaseRate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDeliveryDays">Delivery Days *</Label>
              <Input
                id="estimatedDeliveryDays"
                type="number"
                placeholder="5"
                value={estimatedDeliveryDays}
                onChange={(e) => setEstimatedDeliveryDays(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minOrderValueForFreeShipping">Free Shipping Threshold (INR) - Optional</Label>
            <Input
              id="minOrderValueForFreeShipping"
              type="number"
              step="0.01"
              placeholder="e.g. 5000 (leave blank for no free threshold)"
              value={minOrderValueForFreeShipping}
              onChange={(e) => setMinOrderValueForFreeShipping(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              Orders equal to or above this subtotal qualify for free shipping under this method.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4 shadow-xs">
            <div className="space-y-0.5">
              <Label htmlFor="active" className="text-sm font-semibold">Active Status</Label>
              <p className="text-xs text-muted-foreground">
                Enable or disable this delivery option in the customer storefront.
              </p>
            </div>
            <Switch id="active" checked={active} onCheckedChange={setActive} />
          </div>

          <SheetFooter className="pt-4 border-t gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-sky-700 hover:bg-sky-800 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

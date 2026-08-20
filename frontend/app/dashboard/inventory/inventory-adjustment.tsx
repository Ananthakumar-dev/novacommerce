"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";

import { adjustStockAction } from "@/app/dashboard/inventory/actions";
import type { StockAdjustmentState } from "@/lib/merchant-inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InventoryAdjustmentProps = {
  productId: number;
};

const initialState: StockAdjustmentState = {};

export function InventoryAdjustment({ productId }: InventoryAdjustmentProps) {
  const [state, formAction] = useActionState(
    adjustStockAction.bind(null, String(productId)),
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-3 lg:grid-cols-[130px_100px_1fr_1fr_auto]">
      <div className="space-y-1.5">
        <Label htmlFor={`type-${productId}`} className="text-xs font-semibold">Action</Label>
        <Select name="type" defaultValue="ADD">
          <SelectTrigger id={`type-${productId}`} className="w-full h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADD">Add (+)</SelectItem>
            <SelectItem value="REMOVE">Remove (-)</SelectItem>
            <SelectItem value="SET">Set (=)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`quantity-${productId}`} className="text-xs font-semibold">Quantity</Label>
        <Input
          id={`quantity-${productId}`}
          name="quantity"
          type="number"
          min="0"
          step="1"
          defaultValue="1"
          className="h-9"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`reason-${productId}`} className="text-xs font-semibold">Reason</Label>
        <Input
          id={`reason-${productId}`}
          name="reason"
          placeholder="e.g. Restocked shipment, damaged, count correction"
          className="h-9"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`reference-${productId}`} className="text-xs font-semibold">Reference (PO/Invoice)</Label>
        <Input
          id={`reference-${productId}`}
          name="reference"
          placeholder="e.g. PO-89421, Batch #12"
          className="h-9"
        />
      </div>

      <div className="flex items-end">
        <SubmitButton />
      </div>

      {state.error ? (
        <p className="flex items-center gap-1.5 text-xs text-destructive lg:col-span-5 font-medium">
          <AlertCircle className="size-4" aria-hidden="true" />
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 lg:col-span-5 font-medium">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          {state.success}
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending}
      className="w-full lg:w-auto h-9 bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
    >
      <Save className="size-3.5 mr-1" aria-hidden="true" />
      {pending ? "Saving..." : "Update Stock"}
    </Button>
  );
}

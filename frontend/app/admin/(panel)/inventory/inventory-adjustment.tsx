"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";

import { adjustStockAction } from "@/app/admin/(panel)/inventory/actions";
import type { StockAdjustmentState } from "@/lib/admin-inventory";
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
    <form action={formAction} className="grid gap-3 lg:grid-cols-[130px_110px_1fr_1fr_auto]">
      <div className="space-y-2">
        <Label htmlFor={`type-${productId}`}>Action</Label>
        <Select name="type" defaultValue="ADD">
          <SelectTrigger id={`type-${productId}`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADD">Add</SelectItem>
            <SelectItem value="REMOVE">Remove</SelectItem>
            <SelectItem value="SET">Set</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`quantity-${productId}`}>Qty</Label>
        <Input
          id={`quantity-${productId}`}
          name="quantity"
          type="number"
          min="0"
          step="1"
          defaultValue="1"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`reason-${productId}`}>Reason</Label>
        <Input
          id={`reason-${productId}`}
          name="reason"
          placeholder="New purchase, correction, damage"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`reference-${productId}`}>Reference</Label>
        <Input
          id={`reference-${productId}`}
          name="reference"
          placeholder="Invoice or note"
        />
      </div>

      <div className="flex items-end">
        <SubmitButton />
      </div>

      {state.error ? (
        <p className="flex items-center gap-1.5 text-sm text-destructive lg:col-span-5">
          <AlertCircle className="size-4" aria-hidden="true" />
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground lg:col-span-5">
          <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
          {state.success}
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full lg:w-auto">
      <Save data-icon="inline-start" aria-hidden="true" />
      {pending ? "Saving..." : "Update"}
    </Button>
  );
}

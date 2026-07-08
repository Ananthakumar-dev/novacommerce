import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, History } from "lucide-react";

import {
  listAdminInventory,
  listStockMovements,
  type StockStatus,
  type StockMovementType,
} from "@/lib/admin-inventory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { InventoryAdjustment } from "./inventory-adjustment";

export const metadata: Metadata = {
  title: "Inventory | NovaCommerce Admin",
  description: "Manage product stock and inventory movements.",
};

export default async function InventoryPage() {
  const [items, movements] = await Promise.all([
    listAdminInventory(),
    listStockMovements(),
  ]);

  const totalStock = items.reduce((sum, item) => sum + item.stockQuantity, 0);
  const lowStockCount = items.filter((item) => item.stockStatus === "LOW_STOCK").length;
  const outOfStockCount = items.filter((item) => item.stockStatus === "OUT_OF_STOCK").length;

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl space-y-5 px-5 py-8 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Total stock" value={totalStock} />
          <SummaryCard label="Low stock" value={lowStockCount} />
          <SummaryCard label="Out of stock" value={outOfStockCount} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>
              Review product stock, thresholds, and make audited stock adjustments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {items.length ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-medium">{item.productName}</h2>
                          <Badge variant={stockBadgeVariant(item.stockStatus)}>
                            {stockStatusLabel(item.stockStatus)}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span>SKU {item.sku}</span>
                          <span>{item.category}</span>
                          <span>{item.brand}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/products/${item.productId}/edit`}>
                          Edit product
                        </Link>
                      </Button>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <Metric label="Current stock" value={item.stockQuantity} />
                      <Metric label="Low stock threshold" value={item.lowStockThreshold} />
                      <Metric label="Price" value={formatCurrency(item.salePrice ?? item.price)} />
                    </div>

                    <div className="mt-4 border-t pt-4">
                      <InventoryAdjustment productId={item.productId} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Boxes className="size-4 text-muted-foreground" />
                </span>
                <div>
                  <h2 className="font-medium">No inventory found</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add products before managing stock.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent movements</CardTitle>
            <CardDescription>
              Last stock adjustments across the product catalog.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {movements.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Before</TableHead>
                    <TableHead>After</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <div className="font-medium">{movement.productName}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {movement.sku}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={movementBadgeVariant(movement.type)}>
                          {movementLabel(movement.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell>{movement.stockBefore}</TableCell>
                      <TableCell>{movement.stockAfter}</TableCell>
                      <TableCell>{movement.reason ?? movement.reference ?? "-"}</TableCell>
                      <TableCell>{formatDate(movement.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
                <History className="size-5 text-muted-foreground" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  Stock adjustments will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle>{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function stockStatusLabel(status: StockStatus) {
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function stockBadgeVariant(status: StockStatus) {
  if (status === "OUT_OF_STOCK") {
    return "destructive";
  }

  if (status === "LOW_STOCK") {
    return "outline";
  }

  return "secondary";
}

function movementLabel(type: StockMovementType) {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

function movementBadgeVariant(type: StockMovementType) {
  if (type === "REMOVE") {
    return "destructive";
  }

  if (type === "SET") {
    return "outline";
  }

  return "secondary";
}

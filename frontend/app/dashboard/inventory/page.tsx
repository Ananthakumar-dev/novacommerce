import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, History, Package, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import {
  listMerchantInventory,
  listMerchantStockMovements,
  type StockStatus,
  type StockMovementType,
} from "@/lib/merchant-inventory";
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
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { MerchantNav } from "@/components/merchant/merchant-nav";
import { InventoryAdjustment } from "./inventory-adjustment";

export const metadata: Metadata = {
  title: "Inventory Management | Merchant Dashboard - NovaCommerce",
  description: "Monitor stock quantities, low stock alerts, and record inventory adjustments.",
};

export default async function MerchantInventoryPage() {
  const [items, movements] = await Promise.all([
    listMerchantInventory(),
    listMerchantStockMovements(),
  ]);

  const totalStock = items.reduce((sum, item) => sum + item.stockQuantity, 0);
  const inStockCount = items.filter((item) => item.stockStatus === "IN_STOCK").length;
  const lowStockCount = items.filter((item) => item.stockStatus === "LOW_STOCK").length;
  const outOfStockCount = items.filter((item) => item.stockStatus === "OUT_OF_STOCK").length;

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        <MerchantNav />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Units</span>
                <div className="p-2 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                  <Boxes className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{totalStock}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Across {items.length} products</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">In Stock</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{inStockCount}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Healthy stock levels</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Low Stock</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                  <AlertTriangle className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{lowStockCount}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Below alert threshold</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                  <XCircle className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">{outOfStockCount}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Needs replenishment</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Stock Adjustment Cards */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Stock Levels & Quick Adjustments</CardTitle>
            <CardDescription>
              Adjust current quantities with audit reasons and reference notes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {items.length ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="rounded-xl border border-border/60 p-5 bg-card/50 hover:border-sky-500/20 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-base text-foreground">{item.productName}</h4>
                          <StockBadge status={item.stockStatus} />
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
                          <span>SKU: {item.sku}</span>
                          <span className="font-sans">{item.category}</span>
                          <span className="font-sans">{item.brand}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild className="shrink-0">
                        <Link href={`/dashboard/products/${item.productId}/edit`}>
                          Edit Product
                        </Link>
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/40 border border-border/40 text-center sm:text-left">
                      <div>
                        <span className="text-xs text-muted-foreground">Current Stock</span>
                        <p className="text-lg font-bold text-foreground mt-0.5">{item.stockQuantity}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Alert Threshold</span>
                        <p className="text-lg font-bold text-foreground mt-0.5">{item.lowStockThreshold}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Price</span>
                        <p className="text-lg font-bold text-foreground mt-0.5">${(item.salePrice ?? item.price).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <InventoryAdjustment productId={item.productId} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="size-10 text-muted-foreground mb-3" />
                <h4 className="text-base font-semibold text-foreground">No inventory items found</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Add products to your catalog to start tracking inventory.
                </p>
                <Button asChild className="mt-4 bg-sky-600 hover:bg-sky-700 text-white shadow-xs" size="sm">
                  <Link href="/dashboard/products/add">Add Product</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Movement History */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="size-5 text-sky-600 dark:text-sky-400" />
                Stock Movement Audit Log
              </CardTitle>
              <CardDescription>
                Recent stock increases, reductions, and manual adjustments.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {movements.length ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Before / After</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((movement) => (
                      <TableRow key={movement.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDateTime(movement.createdAt)}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="min-w-36">
                            <span className="font-semibold text-foreground text-sm block truncate">
                              {movement.productName}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {movement.sku}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <MovementBadge type={movement.type} />
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {movement.type === "ADD" ? `+${movement.quantity}` : movement.type === "REMOVE" ? `-${movement.quantity}` : movement.quantity}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {movement.stockBefore} &rarr; <span className="font-bold text-foreground">{movement.stockAfter}</span>
                        </TableCell>
                        <TableCell className="text-xs text-foreground/80 max-w-xs truncate">
                          {movement.reason || "—"}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground max-w-xs truncate">
                          {movement.reference || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No stock movement events recorded yet.
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <SiteFooter />
    </div>
  );
}

function StockBadge({ status }: { status: StockStatus }) {
  if (status === "IN_STOCK") {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-none font-semibold text-xs">
        In Stock
      </Badge>
    );
  }

  if (status === "LOW_STOCK") {
    return (
      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-none font-semibold text-xs">
        Low Stock
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="text-xs">
      Out of Stock
    </Badge>
  );
}

function MovementBadge({ type }: { type: StockMovementType }) {
  if (type === "ADD") {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-none font-semibold text-xs">
        ADD
      </Badge>
    );
  }

  if (type === "REMOVE") {
    return (
      <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-none font-semibold text-xs">
        REMOVE
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-xs font-mono">
      SET
    </Badge>
  );
}

function formatDateTime(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { StorefrontBrand, StorefrontCategory } from "@/lib/storefront"

type ProductFilterFormProps = {
  categories: StorefrontCategory[]
  brands: StorefrontBrand[]
  filters: {
    q: string
    category: string
    brand: string
    minPrice: string
    maxPrice: string
    inStock: string
    sort: string
  }
  idPrefix: string
}

export function ProductFilterForm({
  categories,
  brands,
  filters,
  idPrefix,
}: ProductFilterFormProps) {
  const [category, setCategory] = useState(filters.category || "all")
  const [brand, setBrand] = useState(filters.brand || "all")
  const [inStock, setInStock] = useState(filters.inStock || "all")
  const [sort, setSort] = useState(filters.sort || "newest")

  return (
    <form action="/products" className="space-y-5">
      <input type="hidden" name="category" value={category === "all" ? "" : category} />
      <input type="hidden" name="brand" value={brand === "all" ? "" : brand} />
      <input type="hidden" name="inStock" value={inStock === "all" ? "" : inStock} />
      <input type="hidden" name="sort" value={sort} />

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-q`}>Search</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={`${idPrefix}-q`}
            name="q"
            defaultValue={filters.q}
            placeholder="Search products, brands, SKU"
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Brand</Label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {brands.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-min-price`}>Min price</Label>
          <Input
            id={`${idPrefix}-min-price`}
            name="minPrice"
            defaultValue={filters.minPrice}
            inputMode="numeric"
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-max-price`}>Max price</Label>
          <Input
            id={`${idPrefix}-max-price`}
            name="maxPrice"
            defaultValue={filters.maxPrice}
            inputMode="numeric"
            placeholder="50000"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="space-y-2">
          <Label>Availability</Label>
          <Select value={inStock} onValueChange={setInStock}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any availability</SelectItem>
              <SelectItem value="true">In stock only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sort by</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Newest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button type="submit">
          <SlidersHorizontal />
          Apply
        </Button>
        <Button variant="outline" asChild>
          <a href="/products">
            <X />
            Clear
          </a>
        </Button>
      </div>
    </form>
  )
}

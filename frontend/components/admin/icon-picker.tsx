"use client"

import { createElement, useMemo, useState } from "react"
import {
  Apple,
  BadgeCheck,
  Baby,
  Bike,
  BookOpen,
  BriefcaseBusiness,
  Camera,
  Car,
  Dumbbell,
  Footprints,
  FolderTree,
  Gamepad2,
  Gift,
  HeartPulse,
  House,
  Laptop,
  Monitor,
  Palette,
  Search,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Tag,
  Watch,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const ICONS = {
  Apple,
  BadgeCheck,
  Baby,
  Bike,
  BookOpen,
  BriefcaseBusiness,
  Camera,
  Car,
  Dumbbell,
  Footprints,
  FolderTree,
  Gamepad2,
  Gift,
  HeartPulse,
  House,
  Laptop,
  Monitor,
  Palette,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Tag,
  Watch,
} as const

type IconName = keyof typeof ICONS

type IconPickerProps = {
  defaultValue?: string | null
  fallbackIcon?: IconName
}

export function IconPicker({
  defaultValue,
  fallbackIcon = "Tag",
}: IconPickerProps) {
  const [selected, setSelected] = useState(defaultValue || fallbackIcon)
  const [query, setQuery] = useState("")
  const matches = useMemo(() => {
    const search = query.trim().toLowerCase()

    if (!search) {
      return []
    }

    return Object.keys(ICONS)
      .filter((name) => name.toLowerCase().includes(search))
      .slice(0, 12) as IconName[]
  }, [query])

  return (
    <div className="space-y-2">
      <Label htmlFor="icon-search">Icon</Label>
      <input type="hidden" name="icon" value={selected} />
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
          {createElement(iconFor(selected), {
            className: "size-5 text-muted-foreground",
            "aria-hidden": true,
          })}
        </span>
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="icon-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Lucide icons"
            className="pl-8"
          />
        </div>
      </div>
      {query.trim() ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {matches.length ? (
            matches.map((name) => {
              const isSelected = selected === name

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelected(name)}
                  className={cn(
                    "flex h-20 flex-col items-center justify-center gap-2 rounded-lg border p-2 text-xs transition-colors hover:bg-muted",
                    isSelected && "border-primary bg-primary/10 text-primary"
                  )}
                >
                  {createElement(ICONS[name], {
                    className: "size-5",
                    "aria-hidden": true,
                  })}
                  <span className="w-full truncate text-center">{name}</span>
                </button>
              )
            })
          ) : (
            <div className="col-span-full rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              No matching icons
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export function EntityMark({
  icon,
  image,
  label,
  className,
}: {
  icon?: string | null
  image?: string | null
  label: string
  className?: string
}) {
  if (image) {
    return (
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted bg-cover bg-center",
          className
        )}
        style={{ backgroundImage: `url("${image}")` }}
        aria-label={label}
      >
      </span>
    )
  }

  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted",
        className
      )}
      aria-label={label}
    >
      {icon ? (
        createElement(iconFor(icon), {
          className: "size-5 text-muted-foreground",
          "aria-hidden": true,
        })
      ) : (
        <span className="text-xs font-semibold text-muted-foreground">
          {label.slice(0, 1).toUpperCase()}
        </span>
      )}
    </span>
  )
}

function iconFor(name: string) {
  return ICONS[name as IconName] ?? Tag
}

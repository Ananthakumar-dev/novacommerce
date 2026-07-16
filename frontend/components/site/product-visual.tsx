import { PackageCheck } from "lucide-react"

import { cn } from "@/lib/utils"

type ProductVisualProps = {
  name: string
  imageTone?: string
  accent?: string
  imageUrl?: string | null
  className?: string
}

export function ProductVisual({
  name,
  imageTone = "from-sky-100 via-white to-slate-100",
  accent = "bg-sky-600",
  imageUrl,
  className,
}: ProductVisualProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br",
        imageTone,
        className
      )}
      aria-label={name}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="size-full object-cover"
        />
      ) : (
        <>
          <div className="absolute inset-x-8 bottom-8 h-8 rounded-full bg-black/10 blur-xl" />
          <div className="relative flex size-24 items-center justify-center rounded-2xl border border-white/80 bg-white/75 shadow-sm backdrop-blur">
            <div className={cn("absolute -right-2 -top-2 size-7 rounded-full", accent)} />
            <PackageCheck className="size-11 text-neutral-800" />
          </div>
        </>
      )}
    </div>
  )
}

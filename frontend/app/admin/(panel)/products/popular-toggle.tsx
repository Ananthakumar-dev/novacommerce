"use client"

import { useFormStatus } from "react-dom"
import { Star } from "lucide-react"

import { toggleProductPopularAction } from "@/app/admin/(panel)/products/actions"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type PopularToggleProps = {
  id: number
  popular: boolean
}

export function PopularToggle({ id, popular }: PopularToggleProps) {
  return (
    <form action={toggleProductPopularAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="popular" value={String(!popular)} />
      <Tooltip>
        <TooltipTrigger asChild>
          <PopularButton popular={popular} />
        </TooltipTrigger>
        <TooltipContent>
          {popular ? "Remove from popular" : "Mark as popular"}
        </TooltipContent>
      </Tooltip>
    </form>
  )
}

function PopularButton({ popular }: { popular: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant={popular ? "secondary" : "outline"}
      size="icon-sm"
      disabled={pending}
      aria-label={popular ? "Remove from popular" : "Mark as popular"}
      className={popular ? "text-amber-600 hover:text-amber-700" : ""}
    >
      <Star
        aria-hidden="true"
        className={popular ? "fill-current" : ""}
      />
    </Button>
  )
}

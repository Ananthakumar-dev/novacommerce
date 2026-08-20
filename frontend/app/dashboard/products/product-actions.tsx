"use client"

import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Pencil, Trash2 } from "lucide-react"

import { deleteProductAction } from "@/app/dashboard/products/actions"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ProductActionsProps = {
  id: number
  name: string
}

export function ProductActions({ id, name }: ProductActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" asChild>
            <Link href={`/dashboard/products/${id}/edit`} aria-label="Edit product">
              <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit product</TooltipContent>
      </Tooltip>

      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                aria-label="Delete product"
              >
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Delete product</TooltipContent>
        </Tooltip>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">{name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={deleteProductAction.bind(null, String(id))}>
              <DeleteButton />
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <AlertDialogAction
      type="submit"
      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
      disabled={pending}
    >
      {pending ? "Deleting..." : "Delete"}
    </AlertDialogAction>
  )
}

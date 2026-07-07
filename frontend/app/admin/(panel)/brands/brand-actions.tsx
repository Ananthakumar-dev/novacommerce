"use client"

import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Pencil, Trash2 } from "lucide-react"

import { deleteBrandAction } from "@/app/admin/(panel)/brands/actions"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type BrandActionsProps = {
  id: number
  name: string
}

export function BrandActions({ id, name }: BrandActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/admin/brands/${id}/edit`} aria-label="Edit brand">
              <Pencil aria-hidden="true" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit brand</TooltipContent>
      </Tooltip>

      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Delete brand">
                <Trash2 aria-hidden="true" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Delete brand</TooltipContent>
        </Tooltip>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete brand</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {name}. Brands assigned to products
              cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={deleteBrandAction}>
              <input type="hidden" name="id" value={id} />
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
    <AlertDialogAction type="submit" variant="destructive" disabled={pending}>
      {pending ? "Deleting..." : "Delete"}
    </AlertDialogAction>
  )
}

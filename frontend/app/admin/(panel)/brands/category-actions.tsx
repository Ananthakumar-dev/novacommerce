"use client"

import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Pencil, Trash2 } from "lucide-react"

import { deleteCategoryAction } from "@/app/admin/(panel)/categories/actions"
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

type CategoryActionsProps = {
  id: number
  name: string
}

export function CategoryActions({ id, name }: CategoryActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/admin/categories/${id}/edit`} aria-label="Edit category">
              <Pencil aria-hidden="true" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit category</TooltipContent>
      </Tooltip>

      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Delete category"
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Delete category</TooltipContent>
        </Tooltip>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete category</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {name}. Categories assigned to
              products cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={deleteCategoryAction}>
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
    <AlertDialogAction
      type="submit"
      variant="destructive"
      disabled={pending}
    >
      {pending ? "Deleting..." : "Delete"}
    </AlertDialogAction>
  )
}

"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { AlertCircle, ArrowLeft, Save } from "lucide-react"

import type {
  AdminCategory,
  CategoryFormState,
} from "@/lib/admin-categories"
import { IconPicker } from "@/components/admin/icon-picker"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type CategoryFormProps = {
  action: (
    previousState: CategoryFormState,
    formData: FormData
  ) => Promise<CategoryFormState>
  category?: AdminCategory
}

const initialState: CategoryFormState = {}

export function CategoryForm({ action, category }: CategoryFormProps) {
  const [state, formAction] = useActionState(action, initialState)
  const isEditing = Boolean(category)

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit category" : "Add category"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update category details and product availability."
            : "Create a category for product organization."}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-5">
          {state.error ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <span>{state.error}</span>
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Category name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={category?.name}
                placeholder="Electronics"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={category?.slug}
                placeholder="Auto-generated if blank"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={category?.description ?? ""}
              rows={4}
            />
          </div>

          <IconPicker
            defaultValue={category?.icon}
            fallbackIcon="FolderTree"
          />

          <div className="space-y-2">
            <Label htmlFor="imageFile">Image</Label>
            <input type="hidden" name="image" value={category?.image ?? ""} />
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
            />
            {category?.image ? (
              <p className="text-xs text-muted-foreground">
                Current image saved
              </p>
            ) : null}
          </div>

          <label className="flex w-fit items-center gap-2 text-sm font-medium">
            <input
              name="active"
              type="checkbox"
              defaultChecked={category?.active ?? true}
              className="size-4 rounded border-input accent-primary"
            />
            Active
          </label>
        </CardContent>

        <CardFooter className="justify-between gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/categories">
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Back
            </Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </form>
    </Card>
  )
}

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      <Save data-icon="inline-start" aria-hidden="true" />
      {pending ? "Saving..." : isEditing ? "Save changes" : "Add category"}
    </Button>
  )
}

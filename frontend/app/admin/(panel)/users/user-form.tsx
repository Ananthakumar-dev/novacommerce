"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { AlertCircle, ArrowLeft, Save } from "lucide-react"

import type { AdminUser, UserFormState } from "@/lib/admin-users"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type UserFormProps = {
  action: (
    previousState: UserFormState,
    formData: FormData
  ) => Promise<UserFormState>
  user?: AdminUser
}

const initialState: UserFormState = {}

export function UserForm({ action, user }: UserFormProps) {
  const [state, formAction] = useActionState(action, initialState)
  const isEditing = Boolean(user)

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit user" : "Add user"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update staff or customer account details."
            : "Create a new account for the admin workspace."}
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
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={user?.fullName}
                placeholder="Jane Admin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user?.email}
                placeholder="jane@novacommerce.com"
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">
                {isEditing ? "Password" : "Password"}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder={isEditing ? "Leave blank to keep current" : ""}
                required={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue={user?.role ?? "CUSTOMER"}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="MERCHANT">Merchant</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-between gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/users">
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

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      <Save data-icon="inline-start" aria-hidden="true" />
      {pending ? "Saving..." : isEditing ? "Save changes" : "Add user"}
    </Button>
  )
}

import type { Metadata } from "next"

import { createUserAction } from "@/app/admin/(panel)/users/actions"

import { UserForm } from "../user-form"

export const metadata: Metadata = {
  title: "Add User | NovaCommerce Admin",
  description: "Add a NovaCommerce user.",
}

export default function AddUserPage() {
  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <UserForm action={createUserAction} />
      </div>
    </main>
  )
}

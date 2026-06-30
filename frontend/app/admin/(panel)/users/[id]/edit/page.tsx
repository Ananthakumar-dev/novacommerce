import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { updateUserAction } from "@/app/admin/(panel)/users/actions"
import { getAdminUser } from "@/lib/admin-users"

import { UserForm } from "../../user-form"

export const metadata: Metadata = {
  title: "Edit User | NovaCommerce Admin",
  description: "Edit a NovaCommerce user.",
}

type EditUserPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params
  const user = await getAdminUser(id)

  if (!user) {
    notFound()
  }

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <UserForm action={updateUserAction.bind(null, id)} user={user} />
      </div>
    </main>
  )
}

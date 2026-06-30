import type { Metadata } from "next"
import Link from "next/link"
import { Plus, Users } from "lucide-react"

import { listAdminUsers } from "@/lib/admin-users"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { UserActions } from "./user-actions"

export const metadata: Metadata = {
  title: "Users | NovaCommerce Admin",
  description: "Manage NovaCommerce users.",
}

export default async function UsersPage() {
  const users = await listAdminUsers()

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage admin, merchant, and customer accounts.
            </CardDescription>
            <CardAction>
              <Button asChild>
                <Link href="/admin/users/add">
                  <Plus data-icon="inline-start" aria-hidden="true" />
                  Add user
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {users.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.fullName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{roleLabel(user.role)}</Badge>
                      </TableCell>
                      <TableCell>
                        <UserActions id={user.id} fullName={user.fullName} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Users className="size-4 text-muted-foreground" />
                </span>
                <div>
                  <h2 className="font-medium">No users found</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add the first user to start managing accounts.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function roleLabel(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase()
}

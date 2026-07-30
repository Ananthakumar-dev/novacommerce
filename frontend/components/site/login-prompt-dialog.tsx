"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation"
import { LogIn } from "lucide-react"

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
} from "@/components/ui/alert-dialog"

type LoginPromptDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export function LoginPromptDialog({ isOpen, onClose }: LoginPromptDialogProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLoginRedirect = () => {
    onClose()
    const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`
    router.push(redirectUrl)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent size="sm" className="border border-border/60 shadow-xl bg-background">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 rounded-full p-2 size-12 flex items-center justify-center">
            <LogIn className="size-6" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-lg font-bold">Sign In Required</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            Please sign in to your NovaCommerce account to add items to your shopping cart and complete your purchase.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLoginRedirect}
            className="w-full sm:w-auto bg-sky-700 hover:bg-sky-800 text-white font-medium shadow-xs"
          >
            Sign In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

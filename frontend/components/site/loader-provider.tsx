"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { NovaLoader } from "@/components/ui/nova-loader"

interface LoaderContextType {
  isLoading: boolean
  message: string
  showLoader: (message?: string) => void
  hideLoader: () => void
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined)

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const showLoader = (msg: string = "") => {
    setMessage(msg)
    setIsLoading(true)
  }

  const hideLoader = () => {
    setIsLoading(false)
    setMessage("")
  }

  // Automatically hide the loader when client-side route changes complete
  useEffect(() => {
    hideLoader()
  }, [pathname, searchParams])

  return (
    <LoaderContext.Provider value={{ isLoading, message, showLoader, hideLoader }}>
      {children}
      {isLoading && <NovaLoader overlay={true} message={message} />}
    </LoaderContext.Provider>
  )
}

export function useLoader() {
  const context = useContext(LoaderContext)
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider")
  }
  return context
}

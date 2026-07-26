"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { NovaLoader } from "@/components/ui/nova-loader"

interface LoaderContextType {
  isLoading: boolean
  message: string
  showLoader: (message?: string) => void
  hideLoader: () => void
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined)

function RouteChangeListener({ onRouteChange }: { onRouteChange: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    onRouteChange()
  }, [pathname, searchParams, onRouteChange])

  return null
}

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const showLoader = useCallback((msg: string = "") => {
    setMessage(msg)
    setIsLoading(true)
  }, [])

  const hideLoader = useCallback(() => {
    setIsLoading(false)
    setMessage("")
  }, [])

  return (
    <LoaderContext.Provider value={{ isLoading, message, showLoader, hideLoader }}>
      <Suspense fallback={null}>
        <RouteChangeListener onRouteChange={hideLoader} />
      </Suspense>
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

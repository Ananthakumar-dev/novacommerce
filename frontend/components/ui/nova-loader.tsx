import React from "react"
import { Sparkles } from "lucide-react"

interface NovaLoaderProps {
  overlay?: boolean
  message?: string
}

export function NovaLoader({ overlay = true, message }: NovaLoaderProps) {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      {/* Cosmic Supernova Animation Container */}
      <div className="relative flex items-center justify-center size-28">
        
        {/* Outer orbital ring (dashed/dotted, spins slowly clockwise) */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-sky-400/30 animate-spin-slow" />
        
        {/* Middle orbital ring (with a subtle pulse) */}
        <div className="absolute inset-2 rounded-full border border-indigo-400/20 animate-orbit-pulse" />
        
        {/* Inner gradient ring (spins fast counter-clockwise) */}
        <div className="absolute inset-4 rounded-full border border-transparent border-t-sky-500 border-r-indigo-500 animate-spin-reverse-fast" />
        
        {/* Center glowing core / star */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/50 animate-nova-pulse">
          <Sparkles className="size-5 text-white" />
        </div>
      </div>

      {/* Brand Text Section */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-wider text-foreground">
          Nova<span className="text-sky-600 drop-shadow-[0_0_8px_rgba(2,132,199,0.3)]">Commerce</span>
        </h2>
        {message ? (
          <p className="text-sm font-medium text-muted-foreground animate-pulse max-w-xs px-4">
            {message}
          </p>
        ) : (
          <p className="text-xs tracking-widest text-muted-foreground/60 uppercase">
            Loading storefront
          </p>
        )}
      </div>
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/10 backdrop-blur-xs transition-all duration-300">
        {loaderContent}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      {loaderContent}
    </div>
  )
}

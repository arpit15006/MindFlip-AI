"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // After mounting, we have access to the theme
  React.useEffect(() => {
    // Use requestAnimationFrame to ensure we're in the browser
    // and to delay the state update until after hydration
    const frame = requestAnimationFrame(() => {
      setMounted(true)
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  // During SSR and initial client render, use a simpler provider
  // This ensures consistent rendering between server and client
  if (typeof window === 'undefined' || !mounted) {
    // Return children directly without any theme context
    return <div suppressHydrationWarning>{children}</div>
  }

  // Once mounted on client, use the full theme provider
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

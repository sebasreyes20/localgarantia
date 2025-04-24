"use client"

import { ThemeProvider } from "@/context/theme-context"
import { AuthProvider } from "@/providers/auth-provider"

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}

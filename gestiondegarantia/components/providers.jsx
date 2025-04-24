"use client"

import { ThemeProvider } from "@/context/theme-context"

export function Providers({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

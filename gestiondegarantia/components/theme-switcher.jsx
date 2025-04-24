"use client"

import { useTheme } from "@/context/theme-context"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  // Función para manejar el clic y asegurar que el cambio de tema funcione
  const handleToggleTheme = () => {
    console.log("Cambiando tema de", theme)
    toggleTheme()
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggleTheme}
      className="flex items-center gap-1 bg-blue-600/20 text-white hover:bg-blue-600/30 border-blue-400/40 dark:bg-blue-800/50 dark:hover:bg-blue-700"
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="sr-only md:not-sr-only md:inline-block">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
    </Button>
  )
}

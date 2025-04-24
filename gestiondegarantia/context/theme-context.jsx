"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Crear el contexto con un valor predeterminado
const defaultContextValue = {
  theme: "light",
  toggleTheme: () => {},
}

const ThemeContext = createContext(defaultContextValue)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)

  // Cargar preferencia de tema del localStorage al iniciar
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      try {
        const savedTheme = localStorage.getItem("theme") || "light"
        setTheme(savedTheme)

        // Aplicar clase al documento
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      } catch (error) {
        console.error("Error loading theme preference:", error)
      }
    }
  }, [])

  // Función para cambiar el tema
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light"

      if (typeof window !== "undefined") {
        try {
          // Guardar en localStorage
          localStorage.setItem("theme", newTheme)

          // Aplicar clase al documento
          if (newTheme === "dark") {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        } catch (error) {
          console.error("Error saving theme preference:", error)
        }
      }

      return newTheme
    })
  }

  const contextValue = {
    theme,
    toggleTheme,
  }

  // Evitar problemas de hidratación renderizando solo cuando el componente está montado
  if (!mounted) {
    return <>{children}</>
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    console.error("useTheme must be used within a ThemeProvider")
    // Devolver un valor predeterminado para evitar errores
    return defaultContextValue
  }
  return context
}

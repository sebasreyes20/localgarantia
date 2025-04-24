"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

// Definir el tipo de usuario
const defaultUser = {
  id: null,
  name: "",
  email: "",
  role: "",
}

// Crear el contexto con un valor predeterminado
const defaultContextValue = {
  user: defaultUser,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  checkAuth: () => false,
}

const AuthContext = createContext(defaultContextValue)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(defaultUser)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await checkAuth()

      // Redirigir según la autenticación y la ruta actual
      if (!authenticated) {
        // Si no está autenticado y está en una ruta protegida
        if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
          router.push("/login")
        }
      } else {
        // Si está autenticado y está en login
        if (pathname === "/login") {
          if (user.role === "admin") {
            router.push("/admin/dashboard")
          } else {
            router.push("/dashboard")
          }
        }
      }

      setIsLoading(false)
    }

    checkAuthentication()
  }, [pathname, router, user.role])

  // Función para verificar autenticación
  const checkAuth = async () => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (!token || !userData) {
          setUser(defaultUser)
          setIsAuthenticated(false)
          return false
        }

        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error("Error checking authentication:", error)
      setUser(defaultUser)
      setIsAuthenticated(false)
      return false
    }
  }

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      // Realizar petición al endpoint de login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Guardar datos en localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`
        }

        setUser(data.user)
        setIsAuthenticated(true)

        return { success: true, user: data.user }
      }

      return { success: false, error: data.message || "Credenciales incorrectas" }
    } catch (error) {
      console.error("Error during login:", error)
      return { success: false, error: error.message || "Error al iniciar sesión" }
    }
  }

  // Función para cerrar sesión
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Also clear the cookie
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict"
    }
    setUser(defaultUser)
    setIsAuthenticated(false)
    router.push("/login")
  }

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    console.error("useAuth must be used within an AuthProvider")
    return defaultContextValue
  }
  return context
}

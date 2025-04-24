"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { Eye, EyeOff, LogIn } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Check if a session is already active
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        try {
          const user = JSON.parse(userData)
          if (user.role === "admin") {
            router.push("/admin/dashboard")
          } else if (user.role === "seller") {
            router.push("/dashboard")
          }
        } catch (error) {
          console.error("Error parsing user data:", error)
          // Clear invalid data
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      }
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Attempting to log in with:", email, password)

      // For demonstration purposes, allow access with specific credentials
      if (email === "admin@ejemplo.com" && password === "admin123") {
        console.log("Admin credentials correct")

        const userData = {
          id: "1",
          name: "Administrator",
          email: "admin@ejemplo.com",
          role: "admin",
        }

        // Save data in localStorage
        localStorage.setItem("token", "demo-token-admin")
        localStorage.setItem("user", JSON.stringify(userData))

        // Set cookie for middleware
        document.cookie = `token=demo-token-admin; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`

        setLoginSuccess(true)

        // Redirect after a brief delay
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 1000)

        return
      }

      if (email === "vendedor@ejemplo.com" && password === "vendedor123") {
        console.log("Seller credentials correct")

        const userData = {
          id: "2",
          name: "Demo Seller",
          email: "vendedor@ejemplo.com",
          role: "seller",
        }

        // Save data in localStorage
        localStorage.setItem("token", "demo-token-seller")
        localStorage.setItem("user", JSON.stringify(userData))

        // Set cookie for middleware
        document.cookie = `token=demo-token-seller; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`

        setLoginSuccess(true)

        // Redirect after a brief delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)

        return
      }

      // If credentials do not match predefined ones
      setError("Credenciales incorrectas")
    } catch (err) {
      console.error("Error during login:", err)
      setError("Error de inicio de sesión. Por favor, inténtelo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-yellow-100 dark:from-blue-900 dark:to-yellow-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-t-4 border-blue-500 shadow-lg">
          <CardHeader className="space-y-1">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <CardTitle className="text-2xl font-bold text-center text-blue-800 dark:text-blue-300">
                Iniciar Sesión
              </CardTitle>
            </motion.div>
            <CardDescription className="text-center">Ingrese sus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {loginSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="mb-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800">
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Inicio de sesión exitoso. Redirigiendo...
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400 pr-10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Iniciar Sesión</span>
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/50 rounded-md border border-blue-100 dark:border-blue-800 transition-all duration-200">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">Credenciales de Demostración</p>
              <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <p>
                  <strong>Admin:</strong> admin@ejemplo.com / admin123
                </p>
                <p>
                  <strong>Vendedor:</strong> vendedor@ejemplo.com / vendedor123
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors duration-200"
              >
                Volver al Inicio
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

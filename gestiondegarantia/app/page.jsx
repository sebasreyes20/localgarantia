"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ThemeSwitcher from "@/components/theme-switcher"
import Image from "next/image"

export default function HomePage() {
  const router = useRouter()

  // Check for active session but don't redirect automatically
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        try {
          const user = JSON.parse(userData)
          // Store user role in state instead of redirecting
          console.log("User is logged in as:", user.role)
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-yellow-500 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo empresa.png" alt="SoftwareRP Logo" width={50} height={50} className="rounded-full" />
            <div>
              <h1 className="text-2xl font-bold">SoftwareRP</h1>
              <p className="text-sm opacity-90">Sistema de Garantías</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Link href="/login">
              <Button variant="secondary" className="mr-2 bg-white/20 text-white hover:bg-white/30 border-white/40">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/warranty/new">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">Nueva Garantía</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-300 mb-4">Sistema de Garantías</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Digitaliza el proceso de gestión de garantías para eliminar el papeleo, permitiendo a los clientes enviar
              solicitudes y a los vendedores gestionarlas fácilmente.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-300">Para Clientes</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Complete el formulario de garantía para su producto y reciba actualizaciones sobre el estado de su
                  solicitud.
                </p>
                <Link href="/warranty/new" className="w-full block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600">
                    Solicitar Garantía
                  </Button>
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-yellow-500 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-yellow-600 dark:text-yellow-300">Para Vendedores</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Gestione las solicitudes de garantía, actualice su estado y genere documentos PDF.
                </p>
                <Link href="/login" className="w-full block">
                  <Button className="w-full bg-gradient-to-r from-yellow-600 to-blue-500 hover:from-yellow-700 hover:to-blue-600">
                    Acceder al Panel
                  </Button>
                </Link>
              </div>
            </div>

            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              <p>Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-yellow-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>{new Date().getFullYear()} SoftwareRP. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

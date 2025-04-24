"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { FileText, Clock, CheckCircle, XCircle, PlusCircle, History, ArrowRight } from "lucide-react"

export default function Dashboard() {
  const { toast } = useToast()
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentWarranties, setRecentWarranties] = useState([])

  useEffect(() => {
    // Fetch data from API
    const fetchStats = async () => {
      try {
        setLoading(true)
        // Fetch stats
        const response = await fetch("/api/warranties/stats")

        if (response.ok) {
          const data = await response.json()
          setStats({
            pending: data.pending || 0,
            approved: data.approved || 0,
            rejected: data.rejected || 0,
            total: data.total || 0,
          })
        } else {
          // Fallback to mock data if API fails
          console.error("Error fetching stats, using sample data")
          setStats({
            pending: 5,
            approved: 12,
            rejected: 3,
            total: 20,
          })
        }

        // Fetch recent warranties
        const recentResponse = await fetch("/api/warranties?limit=3")
        if (recentResponse.ok) {
          const { data } = await recentResponse.json()
          if (Array.isArray(data)) {
            setRecentWarranties(data.slice(0, 3))
          } else {
            console.error("Los datos recibidos no son un array:", data)
            setRecentWarranties([])
          }
        } else {
          // Mock data for recent warranties
          setRecentWarranties([
            {
              id: "warranty-1",
              customer_name: "Juan Pérez",
              brand: "Samsung",
              model: "Refrigerador",
              warranty_status: "pending",
              created_at: new Date().toISOString(),
            },
            {
              id: "warranty-2",
              customer_name: "María López",
              brand: "LG",
              model: "Lavadora",
              warranty_status: "approved",
              created_at: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: "warranty-3",
              customer_name: "Carlos Rodríguez",
              brand: "Whirlpool",
              model: "Estufa",
              warranty_status: "rejected",
              created_at: new Date(Date.now() - 172800000).toISOString(),
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Usando datos de muestra.",
          variant: "destructive",
        })

        // Fallback to mock data
        setStats({
          pending: 5,
          approved: 12,
          rejected: 3,
          total: 20,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>
      case "approved":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Aprobada</span>
      case "rejected":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rechazada</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando información del dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <motion.h1
          className="text-3xl font-bold text-blue-800 dark:text-blue-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/dashboard/warranties/new">
            <Button className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nueva Garantía
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="transform transition-all duration-200"
        >
          <Card className="bg-white border-l-4 border-blue-500 shadow-md hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                Total Garantías
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">{stats.total}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="transform transition-all duration-200"
        >
          <Card className="bg-white border-l-4 border-yellow-500 shadow-md hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="transform transition-all duration-200"
        >
          <Card className="bg-white border-l-4 border-green-500 shadow-md hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Aprobadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.approved}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="transform transition-all duration-200"
        >
          <Card className="bg-white border-l-4 border-red-500 shadow-md hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                Rechazadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{stats.rejected}</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Últimas solicitudes de garantía</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWarranties.length > 0 ? (
                recentWarranties.map((warranty, index) => (
                  <motion.div
                    key={warranty.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{warranty.customer_name}</h4>
                        <p className="text-sm text-gray-500">
                          {warranty.brand} {warranty.model}
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(warranty.created_at)}</p>
                      </div>
                      <div className="text-sm">{getStatusBadge(warranty.warranty_status)}</div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">No hay garantías recientes</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-yellow-700 flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>Acceso directo a funciones comunes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/warranties/new">
              <Button
                variant="outline"
                className="w-full justify-between border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                <span className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Crear Nueva Garantía
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/dashboard/warranties">
              <Button
                variant="outline"
                className="w-full justify-between border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-200"
              >
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Ver Garantías Pendientes
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/dashboard/warranties/history">
              <Button
                variant="outline"
                className="w-full justify-between border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                <span className="flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  Ver Historial Completo
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

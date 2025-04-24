"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewWarrantyPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    ownerName: "",
    ownerPhone: "",
    address: "",
    brand: "",
    model: "",
    serial: "",
    purchaseDate: "",
    invoiceNumber: "",
    damagedPart: "",
    damagedPartSerial: "",
    damageDate: "",
    damageDescription: "",
    customerSignature: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const requiredFields = [
      "customerName",
      "customerPhone",
      "address",
      "brand",
      "model",
      "serial",
      "purchaseDate",
      "invoiceNumber",
      "damagedPart",
      "damageDate",
      "damageDescription",
      "customerSignature",
    ]

    const missingFields = requiredFields.filter((field) => !form[field])
    if (missingFields.length > 0) {
      setError(`Campos requeridos faltantes: ${missingFields.join(", ")}`)
      return false
    }

    try {
      new Date(form.purchaseDate)
      new Date(form.damageDate)
    } catch (error) {
      setError("Las fechas deben tener un formato válido")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/warranties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al crear la garantía")
      }

      const data = await response.json()
      toast({
        title: "Éxito",
        description: "La garantía ha sido creada correctamente",
      })
      router.push(`/warranty/${data.id}`)
    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-t-4 border-blue-500">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Nueva Garantía</CardTitle>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Complete todos los campos requeridos (*)
            </p>
          </CardHeader>

          <CardContent>
            {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del Cliente */}
              <div>
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4">Información del Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Nombre del Cliente *</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Teléfono del Cliente *</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      value={form.customerPhone}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Nombre del Propietario</Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      value={form.ownerName}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone">Teléfono del Propietario</Label>
                    <Input
                      id="ownerPhone"
                      name="ownerPhone"
                      value={form.ownerPhone}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Información del Producto */}
              <div>
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4">Información del Producto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca *</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo *</Label>
                    <Input
                      id="model"
                      name="model"
                      value={form.model}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serial">Serial *</Label>
                    <Input
                      id="serial"
                      name="serial"
                      value={form.serial}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Fecha de Compra *</Label>
                    <Input
                      id="purchaseDate"
                      name="purchaseDate"
                      type="date"
                      value={form.purchaseDate}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Número de Factura *</Label>
                    <Input
                      id="invoiceNumber"
                      name="invoiceNumber"
                      value={form.invoiceNumber}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Información del Daño */}
              <div>
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4">Información del Daño</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="damagedPart">Parte Dañada *</Label>
                    <Input
                      id="damagedPart"
                      name="damagedPart"
                      value={form.damagedPart}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="damagedPartSerial">Serial de Parte Dañada</Label>
                    <Input
                      id="damagedPartSerial"
                      name="damagedPartSerial"
                      value={form.damagedPartSerial}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="damageDate">Fecha del Daño *</Label>
                    <Input
                      id="damageDate"
                      name="damageDate"
                      type="date"
                      value={form.damageDate}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="damageDescription">Descripción del Daño *</Label>
                    <Textarea
                      id="damageDescription"
                      name="damageDescription"
                      value={form.damageDescription}
                      onChange={handleChange}
                      required
                      className="w-full min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="customerSignature">Firma del Cliente *</Label>
                    <Input
                      id="customerSignature"
                      name="customerSignature"
                      value={form.customerSignature}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t">
                <Link href="/">
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? "Guardando..." : "Crear Garantía"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

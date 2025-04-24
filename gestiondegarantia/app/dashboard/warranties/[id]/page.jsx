"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@/context/theme-context"
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import SignatureCanvas from "@/components/forms/signature-canvas"
import { use } from "react"

export default function WarrantyDetails({ params }) {
  const { theme } = useTheme()
  const router = useRouter()
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [user, setUser] = useState(null)

  // Estado para los datos de la garantía
  const [warranty, setWarranty] = useState(null)
  const [formData, setFormData] = useState({
    crediMemo: "",
    replacementPart: "",
    replacementSerial: "",
    sellerSignature: null,
    managementDate: "",
    warrantyStatus: "pending",
    technicianNotes: "",
    resolutionDate: "",
  })

  useEffect(() => {
    // Obtener datos del usuario
    if (typeof window !== "undefined") {
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    // Cargar datos de la garantía
    const fetchWarranty = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/warranties/${id}`)

        if (!response.ok) {
          throw new Error("Error loading warranty data")
        }

        const data = await response.json()
        setWarranty(data)

        // Inicializar el formulario con los datos existentes
        setFormData({
          crediMemo: data.crediMemo || "",
          replacementPart: data.replacementPart || "",
          replacementSerial: data.replacementSerial || "",
          sellerSignature: data.sellerSignature || null,
          managementDate: data.managementDate ? new Date(data.managementDate).toISOString().split("T")[0] : "",
          warrantyStatus: data.warrantyStatus || "pending",
          technicianNotes: data.technicianNotes || "",
          resolutionDate: data.resolutionDate ? new Date(data.resolutionDate).toISOString().split("T")[0] : "",
        })
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Error loading warranty data")
      } finally {
        setLoading(false)
      }
    }

    fetchWarranty()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSellerSignature = (signature) => {
    setFormData((prev) => ({ ...prev, sellerSignature: signature }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Fecha Inválida"
      return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(date)
    } catch (error) {
      return "Fecha Inválida"
    }
  }

  const validateDate = (dateString) => {
    if (!dateString) return true
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      // Validar fechas
      if (!validateDate(formData.managementDate)) {
        throw new Error("La fecha de gestión no es válida")
      }
      if (!validateDate(formData.resolutionDate)) {
        throw new Error("La fecha de resolución no es válida")
      }

      // Validar campos obligatorios de la sección del vendedor
      if (formData.warrantyStatus !== "pending") {
        const requiredFields = ["crediMemo", "replacementPart", "managementDate"]
        const missingFields = requiredFields.filter((field) => !formData[field])

        if (missingFields.length > 0 || !formData.sellerSignature) {
          throw new Error("Por favor complete todos los campos requeridos")
        }
      }

      // Preparar datos para enviar a la API
      const dataToSend = {
        crediMemo: formData.crediMemo,
        replacementPart: formData.replacementPart,
        replacementSerial: formData.replacementSerial || null,
        sellerSignature: formData.sellerSignature,
        managementDate: formData.managementDate ? new Date(formData.managementDate).toISOString() : null,
        warrantyStatus: formData.warrantyStatus,
        technicianNotes: formData.technicianNotes || null,
        resolutionDate: formData.resolutionDate ? new Date(formData.resolutionDate).toISOString() : null,
        updatedBy: user?.id || null,
      }

      // Guardar los cambios
      const response = await fetch(`/api/warranties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error saving warranty")
      }

      // Mostrar mensaje de éxito
      setSuccess(true)

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push("/dashboard/warranties")
      }, 2000)
    } catch (err) {
      setError(err.message || "Error saving warranty")
    } finally {
      setSaving(false)
    }
  }

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true)
      const doc = new jsPDF()

      // Configuración del documento
      doc.setFontSize(20)
      doc.setTextColor(0, 51, 153)
      doc.text('Certificado de Garantía', 105, 20, { align: 'center' })

      // Información del cliente
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text('Información del Cliente', 20, 40)
      doc.setFontSize(12)
      doc.text(`Nombre del Cliente: ${warranty.customer_name}`, 20, 55)
      doc.text(`Teléfono: ${warranty.customer_phone}`, 20, 65)
      doc.text(`Dirección: ${warranty.address}`, 20, 75)

      if (warranty.owner_name) {
        doc.text(`Nombre del Propietario: ${warranty.owner_name}`, 20, 85)
        doc.text(`Teléfono del Propietario: ${warranty.owner_phone}`, 20, 95)
      }

      // Información del producto
      doc.setFontSize(14)
      doc.text('Información del Producto', 20, 115)
      doc.setFontSize(12)
      doc.text(`Marca: ${warranty.brand}`, 20, 130)
      doc.text(`Modelo: ${warranty.model}`, 20, 140)
      doc.text(`Número de Serie: ${warranty.serial}`, 20, 150)
      doc.text(`Fecha de Compra: ${new Date(warranty.purchase_date).toLocaleDateString()}`, 20, 160)
      doc.text(`Fecha del Daño: ${new Date(warranty.damage_date).toLocaleDateString()}`, 20, 170)
      doc.text(`Descripción del Daño: ${warranty.damage_description}`, 20, 180)

      // Información del vendedor y estado
      if (warranty.warranty_status !== "pending") {
        doc.setFontSize(14)
        doc.text('Información de la Gestión', 20, 200)
        doc.setFontSize(12)
        doc.text(`Estado: ${warranty.warranty_status.toUpperCase()}`, 20, 215)
        doc.text(`Memo de Crédito: ${warranty.credi_memo || 'N/A'}`, 20, 225)
        doc.text(`Parte Reemplazada: ${warranty.replacement_part || 'N/A'}`, 20, 235)
        doc.text(`Serial de Reemplazo: ${warranty.replacement_serial || 'N/A'}`, 20, 245)
        doc.text(`Fecha de Gestión: ${warranty.management_date ? new Date(warranty.management_date).toLocaleDateString() : 'N/A'}`, 20, 255)
        doc.text(`Notas del Técnico: ${warranty.technician_notes || 'N/A'}`, 20, 265)
        doc.text(`Fecha de Resolución: ${warranty.resolution_date ? new Date(warranty.resolution_date).toLocaleDateString() : 'N/A'}`, 20, 275)

        // Firmas
        if (warranty.seller_signature) {
          doc.setFontSize(14)
          doc.text('Firma del Vendedor', 20, 295)
          doc.addImage(warranty.seller_signature, 'PNG', 20, 305, 50, 30)
        }
      }

      // Pie de página
      doc.setFontSize(10)
      doc.setTextColor(128, 128, 128)
      doc.text(`Generado el ${new Date().toLocaleString()}`, 105, 285, { align: 'center' })

      // Guardar el PDF
      const pdfBlob = doc.output('blob')
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)

      // Descargar automáticamente
      const a = document.createElement("a")
      a.href = url
      a.download = `garantia-${warranty.id}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      console.error("Error al generar PDF:", err)
      setError("Error al generar el PDF")
    } finally {
      setGeneratingPDF(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        text: "Pending",
      },
      approved: {
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        text: "Approved",
      },
      rejected: {
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        text: "Rejected",
      },
      completed: {
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        text: "Completed",
      },
    }

    const config = statusConfig[status] || statusConfig.pending
    return <Badge className={config.className}>{config.text}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-green-500 dark:border-green-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-green-600 dark:text-green-400">
              Changes Saved Successfully
            </CardTitle>
            <CardDescription className="text-center dark:text-gray-300">The warranty has been updated</CardDescription>
          </CardHeader>
          <CardContent className="text-center dark:text-gray-300">
            <p className="mb-4">Redirecting to warranty list...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!warranty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-red-500 dark:border-red-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-red-600 dark:text-red-400">
              Warranty Not Found
            </CardTitle>
            <CardDescription className="text-center dark:text-gray-300">
              The requested warranty could not be found
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard/warranties">
              <Button className="mt-4">Return to Warranty List</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Warranty Details</h1>
          <div className="flex gap-4">
            <Button onClick={handleGeneratePDF} disabled={generatingPDF} className="flex items-center gap-2">
              {generatingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export PDF
                </>
              )}
            </Button>
            <Link href="/dashboard/warranties">
              <Button variant="outline">Back to List</Button>
            </Link>
          </div>
        </div>

        <Card className="border-t-4 border-blue-500 dark:border-blue-700 shadow-lg">
          <CardHeader className="bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Warranty #{warranty.id}</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Created on {new Date(warranty.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              {getStatusBadge(warranty.warranty_status)}
            </div>
          </CardHeader>

          <CardContent className="bg-white dark:bg-gray-800">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="customer" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">Customer Information</TabsTrigger>
                <TabsTrigger value="seller">Seller Information</TabsTrigger>
              </TabsList>

              <TabsContent value="customer">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Customer Name</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.customer_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Customer Phone</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.customer_phone}</p>
                  </div>
                  {warranty.owner_name && (
                    <>
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Owner Name</Label>
                        <p className="text-gray-900 dark:text-white">{warranty.owner_name}</p>
                      </div>
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Owner Phone</Label>
                        <p className="text-gray-900 dark:text-white">{warranty.owner_phone}</p>
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <Label className="text-gray-700 dark:text-gray-300">Address</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.address}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Brand</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.brand}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Model</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.model}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Serial Number</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.serial}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Purchase Date</Label>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(warranty.purchase_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Invoice Number</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.invoice_number}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Damaged Part</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.damaged_part}</p>
                  </div>
                  {warranty.damaged_part_serial && (
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">Damaged Part Serial</Label>
                      <p className="text-gray-900 dark:text-white">{warranty.damaged_part_serial}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Damage Date</Label>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(warranty.damage_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-700 dark:text-gray-300">Damage Description</Label>
                    <p className="text-gray-900 dark:text-white">{warranty.damage_description}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-700 dark:text-gray-300">Customer Signature</Label>
                    <img
                      src={warranty.customer_signature || "/placeholder.svg"}
                      alt="Customer Signature"
                      className="max-w-sm mt-2 border border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seller">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="crediMemo">Credit Memo</Label>
                      <Input id="crediMemo" name="crediMemo" value={formData.crediMemo} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="replacementPart">Replacement Part</Label>
                      <Input
                        id="replacementPart"
                        name="replacementPart"
                        value={formData.replacementPart}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="replacementSerial">Replacement Serial</Label>
                      <Input
                        id="replacementSerial"
                        name="replacementSerial"
                        value={formData.replacementSerial}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="managementDate">Management Date</Label>
                      <Input
                        id="managementDate"
                        name="managementDate"
                        type="date"
                        value={formData.managementDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.warrantyStatus} onValueChange={(value) => handleSelectChange("warrantyStatus", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resolutionDate">Resolution Date</Label>
                      <Input
                        id="resolutionDate"
                        name="resolutionDate"
                        type="date"
                        value={formData.resolutionDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technicianNotes">Technician Notes</Label>
                    <Textarea
                      id="technicianNotes"
                      name="technicianNotes"
                      value={formData.technicianNotes}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Seller Signature</Label>
                    <SignatureCanvas
                      onSave={handleSellerSignature}
                      initialValue={formData.sellerSignature}
                      className="border border-gray-200 dark:border-gray-700 rounded-md"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

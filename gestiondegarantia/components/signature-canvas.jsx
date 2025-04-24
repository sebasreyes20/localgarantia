"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/app/context/language-context"

export default function SignatureCanvas({ onSave, theme }) {
  const { t } = useLanguage()
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)

  // Efecto para configurar el canvas con el color correcto según el tema
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Configurar el fondo según el tema
      ctx.fillStyle = theme === "dark" ? "#374151" : "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar un borde para indicar el área de firma
      ctx.strokeStyle = theme === "dark" ? "#6B7280" : "#E5E7EB"
      ctx.lineWidth = 2
      ctx.strokeRect(0, 0, canvas.width, canvas.height)

      setHasSigned(false)
    }
  }, [theme])

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()

    // Ajustar coordenadas para dispositivos táctiles o ratón
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()

    // Ajustar coordenadas para dispositivos táctiles o ratón
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top

    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = theme === "dark" ? "#ffffff" : "#000000"

    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSigned(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Configurar el fondo según el tema
    ctx.fillStyle = theme === "dark" ? "#374151" : "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibujar un borde para indicar el área de firma
    ctx.strokeStyle = theme === "dark" ? "#6B7280" : "#E5E7EB"
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    setHasSigned(false)
  }

  const saveSignature = () => {
    if (!hasSigned) return

    const canvas = canvasRef.current
    const signatureData = canvas.toDataURL("image/png")
    onSave(signatureData)
  }

  return (
    <div className="space-y-2">
      <Card className="p-1 border-2 border-dashed border-gray-300 dark:border-gray-600">
        <canvas
          ref={canvasRef}
          width={500}
          height={150}
          className="w-full rounded-md touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </Card>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={clearCanvas}
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {t("clearSignature")}
        </Button>
        <Button
          type="button"
          onClick={saveSignature}
          disabled={!hasSigned}
          className={`bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white ${!hasSigned ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {t("saveSignature")}
        </Button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{t("signatureInstructions")}</p>
    </div>
  )
}

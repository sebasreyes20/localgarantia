"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eraser, Check } from "lucide-react"

export default function SignatureCanvas({ onSave, initialValue = null, className = "" }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  // Initialize canvas and load initial value if provided
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    // Mejorar la calidad de la línea
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#000000"
    
    // Habilitar suavizado
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Load initial signature if provided
    if (initialValue) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        setHasSignature(true)
      }
      img.src = initialValue
      img.crossOrigin = "anonymous"
    }

    // Adjust canvas size to parent container and set proper scaling
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        // Get the device pixel ratio
        const dpr = window.devicePixelRatio || 1
        
        // Set display size
        canvas.style.width = `${parent.clientWidth > 600 ? 600 : parent.clientWidth - 2}px`
        canvas.style.height = "200px"
        
        // Set actual size in memory
        canvas.width = (parent.clientWidth > 600 ? 600 : parent.clientWidth - 2) * dpr
        canvas.height = 200 * dpr
        
        // Scale context to match device pixel ratio
        ctx.scale(dpr, dpr)
        
        // Reset context properties after resize
        ctx.lineWidth = 2.5
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.strokeStyle = "#000000"
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"

        // Redraw signature if exists
        if (initialValue && hasSignature) {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
          }
          img.src = initialValue
          img.crossOrigin = "anonymous"
        }
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [initialValue, hasSignature])

  // Handle mouse/touch events with improved precision
  const startDrawing = (e) => {
    e.preventDefault() // Prevenir comportamiento por defecto
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    // Get coordinates based on event type with proper scaling
    const x = ((e.type.includes("touch") ? e.touches[0].clientX : e.clientX) - rect.left) * scaleX
    const y = ((e.type.includes("touch") ? e.touches[0].clientY : e.clientY) - rect.top) * scaleY

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
    setHasSignature(true)
  }

  const draw = (e) => {
    e.preventDefault() // Prevenir comportamiento por defecto
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    // Get coordinates based on event type with proper scaling
    const x = ((e.type.includes("touch") ? e.touches[0].clientX : e.clientX) - rect.left) * scaleX
    const y = ((e.type.includes("touch") ? e.touches[0].clientY : e.clientY) - rect.top) * scaleY

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      ctx.closePath()
      setIsDrawing(false)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas || !hasSignature) return

    const dataUrl = canvas.toDataURL("image/png")
    onSave(dataUrl)
  }

  return (
    <div className="space-y-2">
      <div className={`border rounded-md overflow-hidden bg-white ${className}`} style={{ touchAction: "none" }}>
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={clearCanvas}
          className="flex items-center gap-1 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          <Eraser className="h-4 w-4" />
          <span>Borrar</span>
        </Button>
        <Button
          type="button"
          onClick={saveSignature}
          disabled={!hasSignature}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 transition-colors duration-200"
        >
          <Check className="h-4 w-4" />
          <span>Guardar Firma</span>
        </Button>
      </div>
    </div>
  )
}

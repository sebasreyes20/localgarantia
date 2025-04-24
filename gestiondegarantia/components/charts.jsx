"use client"

import { useEffect, useRef } from "react"

export function PieChart({ data }) {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    // En una implementación real, aquí se usaría una librería como Chart.js o D3.js
    // Para esta demo, creamos un gráfico simple con canvas

    const canvas = chartRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    const radius = (Math.min(width, height) / 2) * 0.8
    const centerX = width / 2
    const centerY = height / 2

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Calcular el total
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Dibujar sectores
    let startAngle = 0
    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = item.color
      ctx.fill()

      // Dibujar etiqueta
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      ctx.fillStyle = "#fff"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${Math.round((item.value / total) * 100)}%`, labelX, labelY)

      startAngle += sliceAngle
    })

    // Dibujar leyenda
    const legendY = height - data.length * 25
    data.forEach((item, index) => {
      const y = legendY + index * 25

      // Cuadrado de color
      ctx.fillStyle = item.color
      ctx.fillRect(20, y, 15, 15)

      // Texto
      ctx.fillStyle = "#000"
      ctx.font = "14px Arial"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(`${item.name} (${item.value})`, 45, y + 7)
    })
  }, [data])

  return <canvas ref={chartRef} width={500} height={400} className="w-full h-full" />
}

export function LineChart({ data }) {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    const canvas = chartRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Encontrar el valor máximo
    const maxValue = Math.max(...data.map((item) => item.warranties)) * 1.2

    // Dibujar ejes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#ccc"
    ctx.stroke()

    // Dibujar línea de datos
    const xStep = (width - padding * 2) / (data.length - 1)
    const yScale = (height - padding * 2) / maxValue

    ctx.beginPath()
    data.forEach((item, index) => {
      const x = padding + index * xStep
      const y = height - padding - item.warranties * yScale

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.stroke()

    // Dibujar puntos
    data.forEach((item, index) => {
      const x = padding + index * xStep
      const y = height - padding - item.warranties * yScale

      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()

      // Valor
      ctx.fillStyle = "#000"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(item.warranties, x, y - 15)

      // Etiqueta del eje X
      ctx.fillText(item.month, x, height - padding + 15)
    })
  }, [data])

  return <canvas ref={chartRef} width={500} height={400} className="w-full h-full" />
}

export function BarChart({ data }) {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    const canvas = chartRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    const padding = 60

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Encontrar el valor máximo
    const maxValue = Math.max(...data.map((item) => item.count)) * 1.2

    // Dibujar ejes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#ccc"
    ctx.stroke()

    // Dibujar barras
    const barWidth = ((width - padding * 2) / data.length) * 0.8
    const barSpacing = ((width - padding * 2) / data.length) * 0.2
    const yScale = (height - padding * 2) / maxValue

    data.forEach((item, index) => {
      const x = padding + index * (barWidth + barSpacing)
      const barHeight = item.count * yScale
      const y = height - padding - barHeight

      // Barra
      ctx.fillStyle = "#8b5cf6"
      ctx.fillRect(x, y, barWidth, barHeight)

      // Valor
      ctx.fillStyle = "#000"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(item.count, x + barWidth / 2, y - 5)

      // Etiqueta del eje X
      ctx.save()
      ctx.translate(x + barWidth / 2, height - padding + 10)
      ctx.rotate(-Math.PI / 4)
      ctx.textAlign = "right"
      ctx.fillText(item.product, 0, 0)
      ctx.restore()
    })
  }, [data])

  return <canvas ref={chartRef} width={500} height={400} className="w-full h-full" />
}

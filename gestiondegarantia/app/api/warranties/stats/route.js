import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Obtener el total de garantías
    const total = await prisma.warranty.count()

    // Obtener garantías por estado
    const pending = await prisma.warranty.count({
      where: { warrantyStatus: "pending" },
    })

    const approved = await prisma.warranty.count({
      where: { warrantyStatus: "approved" },
    })

    const rejected = await prisma.warranty.count({
      where: { warrantyStatus: "rejected" },
    })

    // Obtener el total de usuarios
    const users = await prisma.user.count()

    return NextResponse.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        users,
      }
    })
  } catch (error) {
    console.error("Error fetching warranty stats:", error)
    
    // Verificar si es un error de conexión
    if (error.code === 'P1001') {
      return NextResponse.json(
        {
          success: false,
          message: "Error de conexión con la base de datos",
          error: error.message,
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener estadísticas de garantías",
        error: error.message,
      },
      { status: 500 }
    )
  }
}

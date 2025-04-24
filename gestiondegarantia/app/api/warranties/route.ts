import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let whereClause = {}
    if (status && status !== "all") {
      whereClause = {
        warrantyStatus: status,
      }
    }

    const warranties = await prisma.warranty.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: warranties
    })
  } catch (error) {
    console.error("Error al obtener garantías:", error)
    
    // Detectar error específico de conexión a la base de datos
    if (error.code === 'P1001') {
      return NextResponse.json({
        success: false,
        error: "Error de conexión con la base de datos",
        details: error.message
      }, { status: 503 })
    }

    return NextResponse.json({
      success: false,
      error: "Error al obtener las garantías",
      details: error.message
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validar campos requeridos
    const requiredFields = [
      'customerName',
      'customerPhone',
      'ownerName',
      'ownerPhone',
      'address',
      'brand',
      'model',
      'serial',
      'purchaseDate',
      'invoiceNumber',
      'damagedPart',
      'damageDate',
      'damageDescription',
      'customerSignature'
    ]

    const missingFields = requiredFields.filter(field => !data[field])
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: "Campos requeridos faltantes",
        details: `Los siguientes campos son requeridos: ${missingFields.join(', ')}`
      }, { status: 400 })
    }

    // Validar formato de fechas
    if (isNaN(new Date(data.purchaseDate).getTime())) {
      return NextResponse.json({
        success: false,
        error: "Formato de fecha de compra inválido"
      }, { status: 400 })
    }

    if (isNaN(new Date(data.damageDate).getTime())) {
      return NextResponse.json({
        success: false,
        error: "Formato de fecha de daño inválido"
      }, { status: 400 })
    }

    // Validar que la fecha de daño no sea anterior a la fecha de compra
    if (new Date(data.damageDate) < new Date(data.purchaseDate)) {
      return NextResponse.json({
        success: false,
        error: "La fecha de daño no puede ser anterior a la fecha de compra"
      }, { status: 400 })
    }

    const warranty = await prisma.warranty.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        ownerName: data.ownerName,
        ownerPhone: data.ownerPhone,
        address: data.address,
        brand: data.brand,
        model: data.model,
        serial: data.serial,
        purchaseDate: new Date(data.purchaseDate),
        invoiceNumber: data.invoiceNumber,
        damagedPart: data.damagedPart,
        damagedPartSerial: data.damagedPartSerial || null,
        damageDate: new Date(data.damageDate),
        damageDescription: data.damageDescription,
        customerSignature: data.customerSignature,
        warrantyStatus: "pending",
      },
    })

    return NextResponse.json({
      success: true,
      data: warranty
    })
  } catch (error) {
    console.error("Error al crear garantía:", error)
    
    // Detectar error específico de conexión a la base de datos
    if (error.code === 'P1001') {
      return NextResponse.json({
        success: false,
        error: "Error de conexión con la base de datos",
        details: error.message
      }, { status: 503 })
    }

    return NextResponse.json({
      success: false,
      error: "Error al crear la garantía",
      details: error.message
    }, { status: 500 })
  }
} 
import { prisma } from "@/lib/db"

export async function GET(request) {
  try {
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get("estado")

    // Construir filtros
    const where = {}
    if (estado) {
      where.warrantyStatus = estado
    }

    // Consultar garantías desde la base de datos
    const garantias = await prisma.warranty.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        customerName: true,
        brand: true,
        model: true,
        serial: true,
        createdAt: true,
        warrantyStatus: true,
        crediMemo: true,
      },
    })

    // Transformar datos para mantener compatibilidad con el frontend
    const formattedGarantias = garantias.map((g) => ({
      id: g.id,
      cliente: g.customerName,
      producto: `${g.brand} ${g.model}`,
      serial: g.serial,
      fechaSolicitud: g.createdAt.toISOString().split("T")[0],
      estado: g.warrantyStatus,
      crediMemo: g.crediMemo || "",
    }))

    return Response.json(formattedGarantias)
  } catch (error) {
    console.error("Error al obtener garantías:", error)
    return Response.json({ success: false, mensaje: "Error al obtener las garantías" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // Transformar datos para el formato de la base de datos
    const warrantyData = {
      customerName: data.cliente,
      customerPhone: data.telefono || "",
      address: data.direccion || "",
      brand: data.marca,
      model: data.modelo,
      serial: data.serial,
      purchaseDate: new Date(data.fechaCompra),
      invoiceNumber: data.numeroFactura || "",
      damagedPart: data.piezaDanada || "",
      damagedPartSerial: data.serialPiezaDanada || "",
      damageDate: new Date(data.fechaDano || new Date()),
      damageDescription: data.descripcionDano || "",
      customerSignature: data.firmaCliente || "",
      warrantyStatus: "pendiente",
    }

    // Guardar en la base de datos
    const nuevaGarantia = await prisma.warranty.create({
      data: warrantyData,
    })

    // Transformar para mantener compatibilidad con el frontend
    const responseData = {
      id: nuevaGarantia.id,
      cliente: nuevaGarantia.customerName,
      producto: `${nuevaGarantia.brand} ${nuevaGarantia.model}`,
      serial: nuevaGarantia.serial,
      fechaSolicitud: nuevaGarantia.createdAt.toISOString().split("T")[0],
      estado: nuevaGarantia.warrantyStatus,
      crediMemo: nuevaGarantia.crediMemo || "",
    }

    return Response.json({
      success: true,
      mensaje: "Garantía creada correctamente",
      garantia: responseData,
    })
  } catch (error) {
    console.error("Error al crear garantía:", error)
    return Response.json(
      {
        success: false,
        mensaje: "Error al crear la garantía",
      },
      { status: 500 },
    )
  }
}

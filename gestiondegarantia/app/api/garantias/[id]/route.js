export async function GET(request, { params }) {
  const { id } = params

  // En una implementación real, aquí se consultaría la base de datos
  const garantia = {
    id: Number.parseInt(id),
    nombreCliente: "Juan Pérez",
    telefonoCliente: "555-123-4567",
    nombreDueno: "María Pérez",
    direccionCasa: "Calle Principal #123, Ciudad",
    telefonoDueno: "555-987-6543",
    marcaEquipo: "FrostCool",
    modeloEquipo: "XYZ-123",
    serialEquipo: "FC123456789",
    fechaCompra: "2023-01-15",
    numeroFactura: "F-12345",
    parteDanada: "Compresor",
    serialParteDanada: "CP987654321",
    fechaDano: "2023-05-10",
    descripcionDano: "El equipo no enfría correctamente y hace un ruido extraño al encender.",
    firmaCliente: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",

    // Sección del vendedor (puede estar vacía si aún no se ha gestionado)
    crediMemo: id === "1001" ? "" : "CM-00" + id.substring(1),
    parteReemplazo: id === "1001" ? "" : "Compresor Nuevo",
    serialParteReemplazo: id === "1001" ? "" : "NCP123456789",
    firmaVendedor: id === "1001" ? null : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    fechaGestion: id === "1001" ? "" : "2023-05-20",
    estadoGarantia: id === "1001" ? "pendiente" : id === "1002" ? "aprobada" : "rechazada",
    observacionesTecnico:
      id === "1001" ? "" : "Se reemplazó el compresor dañado por uno nuevo. El equipo funciona correctamente ahora.",
    fechaResolucion: id === "1001" ? "" : "2023-05-25",
  }

  return Response.json(garantia)
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    // En una implementación real, aquí se actualizaría en la base de datos

    return Response.json({
      success: true,
      mensaje: "Garantía actualizada correctamente",
      garantia: { id: Number.parseInt(id), ...data },
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        mensaje: "Error al actualizar la garantía",
      },
      { status: 500 },
    )
  }
}

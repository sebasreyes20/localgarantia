export async function GET(request) {
  // Datos de ejemplo para evitar errores
  const stats = {
    total: 20,
    pendientes: 5,
    aprobadas: 12,
    rechazadas: 3,
  }

  return Response.json(stats)
}

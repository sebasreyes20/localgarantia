export async function GET(request, { params }) {
  const { id } = params

  // En una implementación real, aquí se generaría el PDF
  // y se devolvería como respuesta

  // Simulación de generación de PDF
  return Response.json({
    success: true,
    mensaje: "PDF generado correctamente",
    url: `/pdf/garantia-${id}.pdf`, // URL ficticia
  })
}

export async function GET(request) {
  // In a real implementation, this would query the database for pending warranties
  const pendingWarranties = [
    {
      id: 1001,
      cliente: "Juan Pérez",
      producto: "Refrigerador XYZ-123",
      serial: "RF123456789",
      fechaSolicitud: "2023-05-15",
      estado: "pendiente",
    },
    {
      id: 1004,
      cliente: "Ana Martínez",
      producto: "Estufa GHI-012",
      serial: "ES432109876",
      fechaSolicitud: "2023-05-01",
      estado: "pendiente",
    },
    {
      id: 1008,
      cliente: "Roberto Gómez",
      producto: "Licuadora MNO-789",
      serial: "LC789012345",
      fechaSolicitud: "2023-05-18",
      estado: "pendiente",
    },
  ]

  return Response.json(pendingWarranties)
}

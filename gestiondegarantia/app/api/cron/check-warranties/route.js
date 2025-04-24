import { NextResponse } from "next/server";
import { checkPendingWarranties } from "@/scripts/check-pending-warranties";

export async function GET(request) {
  try {
    // Verificar el token de autorización
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ejecutar el script de verificación
    await checkPendingWarranties();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in cron job:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const warranties = await prisma.warranty.findMany({
      where: {
        warrantyStatus: "pending",
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(warranties)
  } catch (error) {
    console.error("Error fetching pending warranties:", error)
    return NextResponse.json({ message: "Error fetching pending warranties" }, { status: 500 })
  }
}

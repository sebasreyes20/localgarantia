import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const { id } = params

    const warranty = await prisma.warranty.findUnique({
      where: {
        id: id,
      },
    })

    if (!warranty) {
      return NextResponse.json({ error: "Warranty not found" }, { status: 404 })
    }

    return NextResponse.json(warranty)
  } catch (error) {
    console.error("Error fetching warranty:", error)
    return NextResponse.json({ error: "Error fetching warranty", details: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    // Validar que los campos requeridos estén presentes
    if (data.warrantyStatus !== "pending" && !data.crediMemo) {
      return NextResponse.json(
        { error: "Credi memo is required for non-pending status" },
        { status: 400 }
      )
    }

    const warranty = await prisma.warranty.update({
      where: {
        id: id,
      },
      data: {
        crediMemo: data.crediMemo,
        replacementPart: data.replacementPart,
        replacementSerial: data.replacementSerial,
        sellerSignature: data.sellerSignature,
        managementDate: data.managementDate ? new Date(data.managementDate) : null,
        warrantyStatus: data.warrantyStatus,
        technicianNotes: data.technicianNotes,
        resolutionDate: data.resolutionDate ? new Date(data.resolutionDate) : null,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(warranty)
  } catch (error) {
    console.error("Error updating warranty:", error)
    return NextResponse.json(
      { error: "Error updating warranty", details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await prisma.warranty.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({ message: "Warranty deleted successfully" })
  } catch (error) {
    console.error("Error deleting warranty:", error)
    return NextResponse.json(
      { error: "Error deleting warranty", details: error.message },
      { status: 500 }
    )
  }
}

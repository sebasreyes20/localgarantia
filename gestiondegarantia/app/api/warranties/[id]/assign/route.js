import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import { sendSellerAssignmentNotification } from "@/lib/email-service"

export async function POST(request, { params }) {
  try {
    const { id } = params
    const { sellerId } = await request.json()

    // Verificar si la garantía existe
    const existingWarranty = await sql`
      SELECT * FROM warranties WHERE id = ${id}
    `

    if (existingWarranty.length === 0) {
      return NextResponse.json({ success: false, message: "Warranty not found" }, { status: 404 })
    }

    // Check if seller exists
    const seller = await sql`
      SELECT * FROM users WHERE id = ${sellerId} AND role = 'seller'
    `

    if (seller.length === 0) {
      return NextResponse.json({ success: false, message: "Seller not found" }, { status: 404 })
    }

    // Update warranty with assigned seller
    const updatedWarranty = await sql`
      UPDATE warranties 
      SET assigned_to = ${sellerId}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    // Send email notification to seller
    await sendSellerAssignmentNotification(updatedWarranty[0], seller[0])

    return NextResponse.json({
      success: true,
      message: "Warranty assigned successfully",
      warranty: updatedWarranty[0],
    })
  } catch (error) {
    console.error("Error assigning warranty:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error assigning warranty",
      },
      { status: 500 },
    )
  }
}

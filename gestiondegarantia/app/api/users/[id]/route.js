import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import * as argon2 from "argon2"

export async function GET(request, { params }) {
  try {
    const { id } = params

    const user = await sql`
      SELECT id, name, email, role, created_at
      FROM users
      WHERE id = ${id}
    `

    if (user.length === 0) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user[0])
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, message: "Error al obtener el usuario" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    // Verificar si el usuario existe
    const existingUser = await sql`
      SELECT * FROM users WHERE id = ${id}
    `

    if (existingUser.length === 0) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 })
    }

    // Si se está actualizando el correo, verificar que no exista
    if (data.email && data.email !== existingUser[0].email) {
      const emailExists = await sql`
        SELECT * FROM users WHERE email = ${data.email} AND id != ${id}
      `

      if (emailExists.length > 0) {
        return NextResponse.json(
          { success: false, message: "El correo electrónico ya está registrado" },
          { status: 400 },
        )
      }
    }

    // Preparar datos para actualizar
    let updateQuery = `
      UPDATE users 
      SET 
        name = $1, 
        email = $2, 
        role = $3, 
        updated_at = CURRENT_TIMESTAMP
    `

    const updateParams = [
      data.name || existingUser[0].name,
      data.email || existingUser[0].email,
      data.role || existingUser[0].role,
    ]

    // Si hay nueva contraseña, encriptarla
    if (data.password) {
      const hashedPassword = await argon2.hash(data.password)
      updateQuery += `, password = $4`
      updateParams.push(hashedPassword)
    }

    // Añadir la condición WHERE
    updateQuery += ` WHERE id = $${updateParams.length + 1} RETURNING id, name, email, role`
    updateParams.push(id)

    // Ejecutar la actualización
    const result = await sql.unsafe(updateQuery, updateParams)

    return NextResponse.json({
      success: true,
      message: "Usuario actualizado correctamente",
      user: result[0],
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, message: "Error al actualizar el usuario" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // Verificar si el usuario existe
    const existingUser = await sql`
      SELECT * FROM users WHERE id = ${id}
    `

    if (existingUser.length === 0) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 })
    }

    // Eliminar el usuario
    await sql`
      DELETE FROM users WHERE id = ${id}
    `

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado correctamente",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ success: false, message: "Error al eliminar el usuario" }, { status: 500 })
  }
}

import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import * as argon2 from "argon2"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    // Construir la consulta SQL
    let query = `
      SELECT id, name, email, role, created_at
      FROM users
    `

    // Filtrar por rol si se proporciona
    if (role) {
      query += ` WHERE role = '${role}'`
    }

    query += ` ORDER BY name`

    // Ejecutar la consulta
    const users = await sql.unsafe(query)

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, message: "Error al obtener los usuarios" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json()

    // Validar datos requeridos
    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, message: "Todos los campos son obligatorios" }, { status: 400 })
    }

    // Verificar si el correo ya existe
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ success: false, message: "El correo electrónico ya está registrado" }, { status: 400 })
    }

    // Encriptar contraseña
    const hashedPassword = await argon2.hash(password)

    // Insertar usuario
    const result = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role})
      RETURNING id, name, email, role
    `

    return NextResponse.json({
      success: true,
      message: "Usuario creado correctamente",
      user: result[0],
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ success: false, message: "Error al crear el usuario" }, { status: 500 })
  }
}

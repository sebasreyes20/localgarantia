import { NextResponse } from "next/server"
import { hash } from "argon2"
import prisma from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Validar campos requeridos
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 })
    }

    // Encriptar contraseña
    const hashedPassword = await hash(password)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        id: `user-${uuidv4()}`,
        name,
        email,
        password: hashedPassword,
        role: "user", // rol por defecto
      },
    })

    // Retornar usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 })
  }
}

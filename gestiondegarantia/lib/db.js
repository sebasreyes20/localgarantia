import { neon } from "@neondatabase/serverless"
import { PrismaClient } from "@prisma/client"

// Crear una instancia de cliente SQL reutilizable
const sql = neon(process.env.DATABASE_URL)

// Instancia de Prisma Client
let prisma

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  // Evitar múltiples instancias de Prisma Client en desarrollo
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export { prisma, sql }

// Función de utilidad para manejar errores de base de datos
export const handleDbError = (error, customMessage = "Error en la base de datos") => {
  console.error(`Database error: ${error.message}`, error)
  return {
    success: false,
    message: `${customMessage}: ${process.env.NODE_ENV === "development" ? error.message : "Error interno"}`,
  }
}

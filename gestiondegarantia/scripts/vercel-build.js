#!/usr/bin/env node

import { execSync } from "child_process"

async function vercelBuild() {
  try {
    console.log("🚀 Starting Vercel build process...")

    // Verificar variables de entorno críticas
    const criticalEnvVars = ["DATABASE_URL", "NEXTAUTH_SECRET"]

    const missingCriticalVars = criticalEnvVars.filter((varName) => !process.env[varName])
    if (missingCriticalVars.length > 0) {
      console.error(`❌ Missing critical environment variables: ${missingCriticalVars.join(", ")}`)
      console.error("Please set these variables in your Vercel project settings.")
      process.exit(1)
    }

    // Generar Prisma Client
    console.log("🔧 Generating Prisma Client...")
    execSync("npx prisma generate", { stdio: "inherit" })

    // Migrar base de datos (en producción)
    if (process.env.NODE_ENV === "production") {
      console.log("💾 Running database migrations...")
      try {
        execSync("npx prisma migrate deploy", { stdio: "inherit" })
      } catch (migrationError) {
        console.warn("⚠️ Migration warning:", migrationError.message)
        console.log("Continuing build process...")
      }
    }

    // Construir la aplicación Next.js
    console.log("🏗️ Building Next.js application...")
    execSync("next build", { stdio: "inherit" })

    console.log("✅ Vercel build completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Build failed:", error)
    process.exit(1)
  }
}

vercelBuild()

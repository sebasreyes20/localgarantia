const { PrismaClient } = require("@prisma/client")
const argon2 = require("argon2")
const prisma = new PrismaClient()

async function main() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log("✅ Database connection successful!")

    // Create tables if they don't exist (this is handled by Prisma migrations)
    console.log("🔄 Checking database schema...")

    // Seed initial admin user if no users exist
    const userCount = await prisma.user.count()
    if (userCount === 0) {
      console.log("🌱 No users found. Creating initial admin user...")

      // Hash the password
      const hashedPassword = await argon2.hash("admin123")

      await prisma.user.create({
        data: {
          email: "admin@ejemplo.com",
          name: "Administrador",
          role: "admin",
          password: hashedPassword,
        },
      })

      // Create a seller user too
      const sellerPassword = await argon2.hash("vendedor123")
      await prisma.user.create({
        data: {
          email: "vendedor@ejemplo.com",
          name: "Vendedor Demo",
          role: "seller",
          password: sellerPassword,
        },
      })

      console.log("✅ Initial users created successfully!")
    } else {
      console.log(`ℹ️ Found ${userCount} existing users. Skipping seed.`)
    }

    console.log("✅ Database setup completed successfully!")
  } catch (error) {
    console.error("❌ Database setup error:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

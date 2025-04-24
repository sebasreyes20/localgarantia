import { NextResponse } from "next/server"

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    "/",
    "/login",
    "/garantia/nueva",
    "/garantia/solicitar",
    "/garantia/form",
    "/garantia/cliente",
    "/warranty/new", // Added explicit path
    "/warranty/request",
    "/warranty-form",
    "/warranty", // Added base warranty path
  ]

  // Verificar si es una ruta pública o recurso estático
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/api/public/") ||
    pathname.startsWith("/garantia/") ||
    pathname.startsWith("/warranty") || // Changed to catch all warranty routes
    pathname.includes("/_next/") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes("/images/")
  ) {
    return NextResponse.next()
  }

  // Verificar token en cookies o localStorage
  const token = request.cookies.get("token")?.value

  // Si no hay token y se intenta acceder a una ruta protegida, redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Para esta demo, en lugar de verificar el token con JWT,
    // simplemente verificamos si es uno de nuestros tokens de demostración
    if (token === "demo-token-admin") {
      // Si es una ruta de dashboard y el usuario es admin, permitir
      return NextResponse.next()
    } else if (token === "demo-token-seller") {
      // Si es una ruta de admin y el usuario es vendedor, redirigir a dashboard
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      // Si es una ruta de dashboard y el usuario es vendedor, permitir
      return NextResponse.next()
    } else {
      // Token no reconocido, redirigir a login
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("token")
      return response
    }
  } catch (error) {
    console.error("Error en middleware:", error)

    // Limpiar el token inválido y redirigir a login
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    return response
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|public|api/public|warranty|garantia).*)"],
}

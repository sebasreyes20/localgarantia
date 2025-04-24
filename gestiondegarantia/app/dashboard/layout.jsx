"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { History, Home, LogOut, Menu, PlusCircle, ListTodo } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ThemeSwitcher from "@/components/theme-switcher"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"

export default function DashboardLayout({ children }) {
  const { user, logout, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.role !== "seller" && user?.role !== "admin") {
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, router, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-yellow-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-gray-900 text-white">
                <div className="py-6 px-4 border-b border-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-lg font-bold">SW</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">SoftwareRP</h2>
                    <p className="text-sm text-gray-400">Warranty System</p>
                  </div>
                </div>
                <nav className="py-4">
                  <MobileNavItems />
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 hidden md:flex items-center justify-center">
                <span className="text-lg font-bold text-white">SW</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">SoftwareRP</h1>
                <p className="text-sm opacity-90">Warranty System</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <span className="hidden md:inline-block text-sm">Welcome, {user?.name || "Seller"}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-white hover:bg-white/20 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden md:inline-block">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:block w-64 bg-gray-900 text-white">
          <nav className="py-6 px-4 space-y-1">
            <DesktopNavItems />
          </nav>
        </aside>

        <main className="flex-1 bg-gray-50 dark:bg-gray-800 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

function DesktopNavItems() {
  return (
    <>
      <Link href="/dashboard">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200">
          <Home className="h-5 w-5 mr-3" />
          <span>Home</span>
        </div>
      </Link>

      <Link href="/dashboard/warranties">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200">
          <ListTodo className="h-5 w-5 mr-3" />
          <span>All Warranties</span>
        </div>
      </Link>

      <Link href="/dashboard/warranties/new">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200">
          <PlusCircle className="h-5 w-5 mr-3" />
          <span>New Warranty</span>
        </div>
      </Link>

      <Link href="/dashboard/warranties/history">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200">
          <History className="h-5 w-5 mr-3" />
          <span>Warranty History</span>
        </div>
      </Link>
    </>
  )
}

function MobileNavItems() {
  return (
    <>
      <Link href="/dashboard">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
          <Home className="h-5 w-5 mr-3" />
          <span>Home</span>
        </div>
      </Link>

      <Link href="/dashboard/warranties">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
          <ListTodo className="h-5 w-5 mr-3" />
          <span>All Warranties</span>
        </div>
      </Link>

      <Link href="/dashboard/warranties/new">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
          <PlusCircle className="h-5 w-5 mr-3" />
          <span>New Warranty</span>
        </div>
      </Link>

      <Link href="/dashboard/warranties/history">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
          <History className="h-5 w-5 mr-3" />
          <span>Warranty History</span>
        </div>
      </Link>
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Shield, Home, FileText, BarChart3, Map, HelpCircle, LogOut, Menu, TrendingUp } from "lucide-react"
import { User as UserIcon } from "lucide-react"

interface UserData {
  id: number
  email: string
  full_name: string
}

export default function Navigation() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Get user from cookie (in a real app, you'd make an API call)
    const userCookie = document.cookie.split("; ").find((row) => row.startsWith("user="))

    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split("=")[1]))
        setUser(userData)
      } catch (error) {
        console.error("Error parsing user cookie:", error)
      }
    }
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/login")
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/report", label: "Report Crime", icon: FileText },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/historical-dashboard", label: "5-Year Analytics", icon: TrendingUp },
    { href: "/heatmap", label: "Crime Heatmap", icon: Map },
    { href: "/help", label: "Help Center", icon: HelpCircle },
  ]

  const NavContent = () => (
    <>
      <div className="flex items-center space-x-2 mb-8">
        <Shield className="h-8 w-8 text-blue-600" />
        <span className="text-xl font-bold">CrimeReport</span>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {user && (
        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center space-x-3 px-3 py-2 mb-2">
            <UserIcon className="h-5 w-5 text-gray-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-6">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex flex-col flex-1 min-h-0 p-6">
          <NavContent />
        </div>
      </div>
    </>
  )
}

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface User {
  id: number
  email: string
  full_name: string
  phone?: string
}

// Mock user data for demo (replace with actual database queries)
const mockUsers: (User & { password: string })[] = [
  {
    id: 1,
    email: "demo@example.com",
    password: "password123",
    full_name: "Demo User",
    phone: "555-0123",
  },
]

export async function login(email: string, password: string): Promise<User | null> {
  // In a real app, hash the password and query the database
  const user = mockUsers.find((u) => u.email === email && u.password === password)
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export async function register(
  email: string,
  password: string,
  fullName: string,
  phone?: string,
): Promise<User | null> {
  // In a real app, hash the password and insert into database
  const newUser: User = {
    id: mockUsers.length + 1,
    email,
    full_name: fullName,
    phone,
  }
  mockUsers.push({ ...newUser, password })
  return newUser
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("user")
  if (userCookie) {
    try {
      return JSON.parse(userCookie.value)
    } catch {
      return null
    }
  }
  return null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

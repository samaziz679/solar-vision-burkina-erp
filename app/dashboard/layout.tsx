import type React from "react"
import UserButton from "@/components/auth/user-button"

// Assuming the rest of the code is here

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <UserButton />
      {children}
    </div>
  )
}

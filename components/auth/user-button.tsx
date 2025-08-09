"use client"
import { useRouter } from "next/navigation"
import { LogOut, Settings, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getBrowserClient } from "@/lib/supabase/client"

export type UserButtonProps = {
  name?: string
  email?: string
  imageUrl?: string
  onSignOut?: () => void
}

export default function UserButton({
  name = "User",
  email = "user@example.com",
  imageUrl = "/placeholder-user.jpg",
  onSignOut,
}: UserButtonProps) {
  const router = useRouter()

  async function handleSignOut() {
    if (onSignOut) {
      onSignOut()
      return
    }
    try {
      const supabase = getBrowserClient()
      await supabase.auth.signOut()
      router.push("/login")
    } catch (err) {
      // Fallback if sign-out fails for any reason
      router.push("/login")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 px-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={imageUrl || "/placeholder.svg"} alt="User avatar" />
              <AvatarFallback>{(name ?? "U").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium">{name}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-700">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

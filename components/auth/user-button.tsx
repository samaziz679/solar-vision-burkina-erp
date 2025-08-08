'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut, Settings } from 'lucide-react'

type SimpleUser = {
  email?: string | null
  user_metadata?: {
    name?: string | null
    avatar_url?: string | null
  } | null
}

export function UserButton({ user }: { user?: SimpleUser | null }) {
  const router = useRouter()
  const supabase = createClient()

  const displayName = useMemo(() => {
    return (
      user?.user_metadata?.name ||
      user?.email?.split('@')[0] ||
      'User'
    )
  }, [user])

  const initials = useMemo(() => {
    const name = displayName || ''
    const parts = name.trim().split(' ')
    const first = parts[0]?.[0] || user?.email?.[0] || 'U'
    const second = parts.length > 1 ? parts[1]?.[0] : ''
    return `${first}${second}`.toUpperCase()
  }, [displayName, user])

  async function handleSignOut() {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch {
      // best-effort sign out; still redirect
      router.push('/login')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.user_metadata?.avatar_url || undefined}
              alt={displayName || 'User avatar'}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline-block max-w-[160px] truncate">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

UserButton.defaultProps = {
  user: null,
}

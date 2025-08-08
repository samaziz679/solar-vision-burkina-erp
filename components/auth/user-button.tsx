'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, UserIcon } from 'lucide-react'

type AnyUser = {
  email?: string | null
  user_metadata?: {
    full_name?: string | null
    name?: string | null
    avatar_url?: string | null
    picture?: string | null
  }
} | null | undefined

export function UserButton({ user }: { user?: AnyUser }) {
  const router = useRouter()
  const supabase = React.useMemo(() => createClient(), [])

  const fullName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    (user?.email ? user.email.split('@')[0] : 'User')

  const avatarUrl =
    user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? undefined

  async function handleSignOut() {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      // no-op; still route away
    } finally {
      router.push('/login')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={`${fullName}'s avatar`} />
              ) : (
                <AvatarFallback>
                  <UserIcon className="h-4 w-4" />
                </AvatarFallback>
              )}
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline">{fullName}</span>
          </div>
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{fullName}</span>
            {user?.email ? (
              <span className="text-xs text-muted-foreground">{user.email}</span>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          <UserIcon className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

UserButton.defaultProps = {
  user: null,
}

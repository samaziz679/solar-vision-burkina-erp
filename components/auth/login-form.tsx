"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, signup } from "@/lib/auth"

export function LoginForm() {
  const [loginState, loginAction, isLoginPending] = useActionState(login, undefined)
  const [signupState, signupAction, isSignupPending] = useActionState(signup, undefined)

  return (
    <div className="grid gap-4">
      <form className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button formAction={loginAction} className="w-full" disabled={isLoginPending}>
          {isLoginPending ? "Logging in..." : "Login"}
        </Button>
        {loginState?.error && <p className="text-sm text-red-500">{loginState.error}</p>}
        <Button
          formAction={signupAction}
          className="w-full bg-transparent"
          variant="outline"
          disabled={isSignupPending}
        >
          {isSignupPending ? "Signing up..." : "Sign Up"}
        </Button>
        {signupState?.error && <p className="text-sm text-red-500">{signupState.error}</p>}
      </form>
    </div>
  )
}

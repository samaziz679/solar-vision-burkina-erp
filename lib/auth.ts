import { createServerClient } from "./supabase/server"
import type { UserRole } from "./supabase/types"

export async function getCurrentUser() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserRoles(userId: string): Promise<UserRole[]> {
  const supabase = await createServerClient()
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId)

  return roles?.map((r) => r.role) || []
}

export async function hasRole(userId: string, role: UserRole): Promise<boolean> {
  const roles = await getUserRoles(userId)
  return roles.includes(role)
}

export async function hasAnyRole(userId: string, roles: UserRole[]): Promise<boolean> {
  const userRoles = await getUserRoles(userId)
  return roles.some((role) => userRoles.includes(role))
}

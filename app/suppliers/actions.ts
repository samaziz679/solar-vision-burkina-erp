"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Supplier } from "@/lib/supabase/types"

export async function createSupplier(formData: Omit<Supplier, "id" | "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("suppliers").insert({ ...formData, user_id: user.id })

  if (error) {
    console.error("Error creating supplier:", error)
    throw new Error("Failed to create supplier.")
  }

  revalidatePath("/suppliers")
}

export async function updateSupplier(id: string, formData: Omit<Supplier, "id" | "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("suppliers").update(formData).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating supplier:", error)
    throw new Error("Failed to update supplier.")
  }

  revalidatePath("/suppliers")
  revalidatePath(`/suppliers/${id}/edit`)
}

export async function deleteSupplier(id: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("suppliers").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting supplier:", error)
    throw new Error("Failed to delete supplier.")
  }

  revalidatePath("/suppliers")
}

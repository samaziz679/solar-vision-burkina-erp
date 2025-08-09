"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const supplierSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Supplier name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export async function createSupplier(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const parsed = supplierSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  })

  if (!parsed.success) {
    console.error(parsed.error.flatten().fieldErrors)
    return {
      message: "Failed to create supplier due to validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const { data, error } = await supabase
    .from("suppliers")
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single()

  if (error) {
    console.error("Error creating supplier:", error)
    return { message: "Failed to create supplier." }
  }

  revalidatePath("/suppliers")
  revalidatePath("/dashboard")
  redirect("/suppliers")
}

export async function updateSupplier(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const parsed = supplierSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  })

  if (!parsed.success) {
    console.error(parsed.error.flatten().fieldErrors)
    return {
      message: "Failed to update supplier due to validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const { id, ...updateData } = parsed.data

  if (!id) {
    return { message: "Supplier ID is missing for update." }
  }

  const { error } = await supabase.from("suppliers").update(updateData).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating supplier:", error)
    return { message: "Failed to update supplier." }
  }

  revalidatePath("/suppliers")
  revalidatePath("/dashboard")
  redirect("/suppliers")
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
    return { message: "Failed to delete supplier." }
  }

  revalidatePath("/suppliers")
  revalidatePath("/dashboard")
  return { message: "Supplier deleted successfully." }
}

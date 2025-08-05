"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const supplierSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  contact_person: z.string().min(1, "Contact person is required").max(255),
  email: z.string().email("Invalid email address").min(1, "Email is required").max(255),
  phone: z.string().min(1, "Phone is required").max(20),
  address: z.string().min(1, "Address is required").max(255),
})

export async function createSupplier(values: z.infer<typeof supplierSchema>) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const validatedFields = supplierSchema.safeParse(values)

  if (!validatedFields.success) {
    throw new Error("Invalid fields for supplier creation.")
  }

  const { data, error } = await supabase
    .from("suppliers")
    .insert({ ...validatedFields.data, user_id: user.id })
    .select()
    .single()

  if (error) {
    console.error("Error creating supplier:", error)
    throw new Error("Failed to create supplier.")
  }

  revalidatePath("/suppliers")
  return data
}

export async function updateSupplier(id: string, values: z.infer<typeof supplierSchema>) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const validatedFields = supplierSchema.safeParse(values)

  if (!validatedFields.success) {
    throw new Error("Invalid fields for supplier update.")
  }

  const { data, error } = await supabase
    .from("suppliers")
    .update(validatedFields.data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating supplier:", error)
    throw new Error("Failed to update supplier.")
  }

  revalidatePath("/suppliers")
  return data
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

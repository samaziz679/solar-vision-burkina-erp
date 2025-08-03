import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EditProductForm } from "@/components/inventory/edit-product-form"
import { getProductById } from "@/lib/data/products"

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const product = await getProductById(params.id, user.id)

  if (!product) {
    redirect("/inventory")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Edit Product</h2>
        <EditProductForm initialData={product} />
      </div>
    </div>
  )
}

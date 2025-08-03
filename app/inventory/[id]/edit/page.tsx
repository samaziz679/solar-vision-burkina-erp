import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProductForm } from "@/components/inventory/product-form"
import { getProductById } from "@/lib/data/products"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  const product = await getProductById(params.id, data.user.id)

  if (!product) {
    redirect("/inventory")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Edit Product</h1>
        <ProductForm initialData={product} />
      </div>
    </div>
  )
}

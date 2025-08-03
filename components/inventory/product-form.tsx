"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addProduct, updateProduct } from "@/app/inventory/actions"
import type { Tables } from "@/lib/supabase/types"
import { toast } from "sonner"

type Product = Tables<"products">

interface ProductFormProps {
  initialData?: Product
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(initialData ? updateProduct : addProduct, {
    success: false,
    message: "",
    errors: undefined,
  })

  const handleSubmit = async (formData: FormData) => {
    const result = await formAction(formData)
    if (result.success) {
      toast.success(result.message)
      router.push("/inventory")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="grid gap-4">
          {initialData && <input type="hidden" name="id" value={initialData.id} />}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={initialData?.name || ""} required />
            {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" step="0.01" defaultValue={initialData?.price || ""} required />
            {state?.errors?.price && <p className="text-red-500 text-sm">{state.errors.price}</p>}
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" name="stock" type="number" defaultValue={initialData?.stock || ""} required />
            {state?.errors?.stock && <p className="text-red-500 text-sm">{state.errors.stock}</p>}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" defaultValue={initialData?.category || ""} />
            {state?.errors?.category && <p className="text-red-500 text-sm">{state.errors.category}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={initialData?.description || ""} rows={3} />
            {state?.errors?.description && <p className="text-red-500 text-sm">{state.errors.description}</p>}
          </div>
          {/* Temporarily removed image_url field for debugging */}
          {/* <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={initialData?.image_url || ""}
            />
            {state?.errors?.image_url && <p className="text-red-500 text-sm">{state.errors.image_url}</p>}
          </div> */}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : initialData ? "Save Changes" : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

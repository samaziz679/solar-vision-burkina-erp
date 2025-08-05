"use client"

import type React from "react"

import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProduct } from "@/app/inventory/actions"
import { toast } from "sonner"
import Image from "next/image"

export function ProductForm() {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await createProduct(formData)
    if (result.success) {
      toast.success("Product created successfully!")
      router.push("/inventory")
    } else {
      toast.error(result.error)
    }
    return result
  }, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" required />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" name="price" type="number" step="0.01" required />
      </div>
      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input id="stock" name="stock" type="number" required />
      </div>
      <div>
        <Label htmlFor="image">Product Image</Label>
        <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div className="mt-2">
            <Image
              src={imagePreview || "/placeholder.png"}
              alt="Image Preview"
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
          </div>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Product"}
      </Button>
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
    </form>
  )
}

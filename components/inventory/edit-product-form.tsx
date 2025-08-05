"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/lib/supabase/types"
import { updateProduct } from "@/app/inventory/actions"
import { toast } from "sonner"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"

interface EditProductFormProps {
  initialData: Product
}

export function EditProductForm({ initialData }: EditProductFormProps) {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.image_url)
  const [removeImage, setRemoveImage] = useState<boolean>(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setRemoveImage(false) // If new image is selected, don't remove
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(initialData.image_url) // Revert to initial if no file selected
    }
  }

  const handleRemoveImageChange = (checked: boolean) => {
    setRemoveImage(checked)
    if (checked) {
      setImagePreview(null) // Clear preview if removing
    } else {
      setImagePreview(initialData.image_url) // Restore original preview if unchecking
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    formData.set("existing_image_url", initialData.image_url || "")
    formData.set("remove_image", removeImage.toString())

    try {
      const result = await updateProduct(initialData.id, formData)
      if (result.success) {
        toast.success("Product updated successfully!")
        router.push("/inventory")
      } else {
        toast.error(result.error)
        setError(result.error)
      }
    } catch (e: any) {
      toast.error("An unexpected error occurred.", { description: e.message })
      setError(e.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={initialData.name} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={initialData.description} required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" defaultValue={initialData.category} required />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" name="price" type="number" step="0.01" defaultValue={initialData.price} required />
      </div>
      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input id="stock" name="stock" type="number" defaultValue={initialData.stock} required />
      </div>
      <div>
        <Label htmlFor="image">Product Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={removeImage}
        />
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
        {initialData.image_url && (
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox id="remove_image" checked={removeImage} onCheckedChange={handleRemoveImageChange} />
            <label
              htmlFor="remove_image"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remove existing image
            </label>
          </div>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update Product"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}

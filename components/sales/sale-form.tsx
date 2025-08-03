"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addSale, updateSale } from "@/app/sales/actions"
import type { Tables } from "@/lib/supabase/types"
import { toast } from "sonner"

type Sale = Tables<"sales">
type Product = Tables<"products">
type Client = Tables<"clients">

interface SaleFormProps {
  initialData?: Sale
  products: Product[]
  clients: Client[]
}

export function SaleForm({ initialData, products, clients }: SaleFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(initialData ? updateSale : addSale, {
    success: false,
    message: "",
    errors: undefined,
  })

  const handleSubmit = async (formData: FormData) => {
    const result = await formAction(formData)
    if (result.success) {
      toast.success(result.message)
      router.push("/sales")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Sale" : "Add New Sale"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="grid gap-4">
          {initialData && <input type="hidden" name="id" value={initialData.id} />}
          <div>
            <Label htmlFor="product_id">Product</Label>
            <Select name="product_id" defaultValue={initialData?.product_id || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.product_id && <p className="text-red-500 text-sm">{state.errors.product_id}</p>}
          </div>
          <div>
            <Label htmlFor="client_id">Client</Label>
            <Select name="client_id" defaultValue={initialData?.client_id || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.client_id && <p className="text-red-500 text-sm">{state.errors.client_id}</p>}
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" name="quantity" type="number" defaultValue={initialData?.quantity || ""} required />
            {state?.errors?.quantity && <p className="text-red-500 text-sm">{state.errors.quantity}</p>}
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              defaultValue={initialData?.amount || ""}
              required
            />
            {state?.errors?.amount && <p className="text-red-500 text-sm">{state.errors.amount}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : initialData ? "Save Changes" : "Add Sale"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

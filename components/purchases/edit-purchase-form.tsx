'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updatePurchase } from '@/app/purchases/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Database } from '@/lib/supabase/types'

type Purchase = Database['public']['Tables']['purchases']['Row']
type Product = Database['public']['Tables']['products']['Row']
type Supplier = Database['public']['Tables']['suppliers']['Row']

interface EditPurchaseFormProps {
  initialData: Purchase
  products: Product[]
  suppliers: Supplier[]
}

export function EditPurchaseForm({ initialData, products, suppliers }: EditPurchaseFormProps) {
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(initialData ? new Date(initialData.purchase_date) : undefined)
  const [productId, setProductId] = useState(initialData?.product_id || '')
  const [supplierId, setSupplierId] = useState(initialData?.supplier_id || '')
  const [quantity, setQuantity] = useState<number | ''>(initialData?.quantity || '')
  const [unitPrice, setUnitPrice] = useState<number | ''>(initialData?.unit_price || '')
  const [totalAmount, setTotalAmount] = useState<number | ''>(initialData?.total_amount || '')
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (quantity && unitPrice) {
      setTotalAmount(quantity * unitPrice)
    } else {
      setTotalAmount('')
    }
  }, [quantity, unitPrice])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData()
    formData.append('id', initialData.id)
    formData.append('purchase_date', purchaseDate ? format(purchaseDate, 'yyyy-MM-dd') : '')
    formData.append('product_id', productId)
    formData.append('supplier_id', supplierId)
    formData.append('quantity', String(quantity))
    formData.append('unit_price', String(unitPrice))
    formData.append('total_amount', String(totalAmount))

    const result = await updatePurchase(formData)

    if (result.success) {
      toast.success('Purchase updated successfully!')
      router.push('/purchases')
    } else {
      toast.error(result.message || 'Failed to update purchase.')
      if (result.errors) {
        result.errors.forEach(err => toast.error(err.message));
      }
    }
    setIsPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="purchase_date">Purchase Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !purchaseDate && 'text-muted-foreground'
              )}
              disabled={isPending}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {purchaseDate ? format(purchaseDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={purchaseDate}
              onSelect={setPurchaseDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product_id">Product</Label>
        <Select value={productId} onValueChange={setProductId} disabled={isPending}>
          <SelectTrigger>
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="supplier_id">Supplier</Label>
        <Select value={supplierId} onValueChange={setSupplierId} disabled={isPending}>
          <SelectTrigger>
            <SelectValue placeholder="Select supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          step="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          required
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unit_price">Unit Price</Label>
        <Input
          id="unit_price"
          type="number"
          step="0.01"
          value={unitPrice}
          onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
          required
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="total_amount">Total Amount</Label>
        <Input
          id="total_amount"
          type="number"
          step="0.01"
          value={totalAmount}
          readOnly
          disabled={true} // Always disabled as it's calculated
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  )
}

// This file is no longer needed as purchase-form.tsx handles both create and edit.
// It will be removed in a future update.

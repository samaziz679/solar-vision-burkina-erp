'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPurchase, updatePurchase } from '@/app/purchases/actions'
import { toast } from 'sonner'
import { Purchase, Product, Supplier } from '@/lib/supabase/types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PurchaseFormProps {
  initialData?: Purchase
  products: Product[]
  suppliers: Supplier[]
}

export function PurchaseForm({ initialData, products, suppliers }: PurchaseFormProps) {
  const [supplierId, setSupplierId] = useState(initialData?.supplier_id || '')
  const [productId, setProductId] = useState(initialData?.product_id || '')
  const [quantity, setQuantity] = useState(initialData?.quantity?.toString() || '')
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(
    initialData?.purchase_date ? new Date(initialData.purchase_date) : undefined
  )
  const [totalAmount, setTotalAmount] = useState(initialData?.total_amount?.toString() || '')
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setSupplierId(initialData.supplier_id || '')
      setProductId(initialData.product_id || '')
      setQuantity(initialData.quantity?.toString() || '')
      setPurchaseDate(initialData.purchase_date ? new Date(initialData.purchase_date) : undefined)
      setTotalAmount(initialData.total_amount?.toString() || '')
    }
  }, [initialData])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)
    setErrors({})
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    if (initialData?.id) {
      formData.append('id', initialData.id)
    }
    formData.set('purchase_date', purchaseDate ? format(purchaseDate, 'yyyy-MM-dd') : '')

    const action = initialData ? updatePurchase : createPurchase
    const result = await action(undefined, formData) // Pass undefined for prevState

    if (result?.errors) {
      setErrors(result.errors)
      setMessage(result.message)
      toast.error(result.message)
    } else if (result?.message) {
      setMessage(result.message)
      toast.error(result.message)
    } else {
      toast.success(initialData ? 'Purchase updated successfully!' : 'Purchase created successfully!')
    }
    setIsPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input type="hidden" name="id" value={initialData?.id} />
      <div className="grid gap-2">
        <Label htmlFor="supplier_id">Supplier</Label>
        <Select onValueChange={setSupplierId} value={supplierId} disabled={isPending}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" name="supplier_id" value={supplierId} />
        {errors.supplier_id && <p className="text-red-500 text-sm">{errors.supplier_id.join(', ')}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product_id">Product</Label>
        <Select onValueChange={setProductId} value={productId} disabled={isPending}>
          <SelectTrigger className="w-full">
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
        <input type="hidden" name="product_id" value={productId} />
        {errors.product_id && <p className="text-red-500 text-sm">{errors.product_id.join(', ')}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          step="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g., 10"
          required
          disabled={isPending}
        />
        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.join(', ')}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="purchase_date">Purchase Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className="w-full justify-start text-left font-normal"
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
        <input type="hidden" name="purchase_date" value={purchaseDate ? format(purchaseDate, 'yyyy-MM-dd') : ''} />
        {errors.purchase_date && <p className="text-red-500 text-sm">{errors.purchase_date.join(', ')}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="total_amount">Total Amount</Label>
        <Input
          id="total_amount"
          name="total_amount"
          type="number"
          step="0.01"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="e.g., 2500.00"
          required
          disabled={isPending}
        />
        {errors.total_amount && <p className="text-red-500 text-sm">{errors.total_amount.join(', ')}</p>}
      </div>
      {message && <p className="text-red-500 text-sm">{message}</p>}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Purchase' : 'Create Purchase')}
      </Button>
    </form>
  )
}

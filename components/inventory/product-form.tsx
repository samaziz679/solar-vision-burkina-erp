'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createProduct, State } from '@/app/inventory/actions';
import { toast } from 'sonner';

export default function ProductForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createProduct, initialState);

  // Show toast messages for success or error
  if (state?.message) {
    if (state.message.includes('Failed')) {
      toast.error(state.message);
    } else {
      toast.success(state.message);
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          aria-describedby="name-error"
        />
        {state?.errors?.name && (
          <div id="name-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.name.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          aria-describedby="description-error"
        />
        {state?.errors?.description && (
          <div id="description-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.description.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          required
          aria-describedby="price-error"
        />
        {state?.errors?.price && (
          <div id="price-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.price.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="stock_quantity">Stock Quantity</Label>
        <Input
          id="stock_quantity"
          name="stock_quantity"
          type="number"
          required
          aria-describedby="stock-quantity-error"
        />
        {state?.errors?.stock_quantity && (
          <div id="stock-quantity-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.stock_quantity.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          name="sku"
          type="text"
          aria-describedby="sku-error"
        />
        {state?.errors?.sku && (
          <div id="sku-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.sku.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <Button type="submit" className="w-full">
        Create Product
      </Button>
    </form>
  );
}

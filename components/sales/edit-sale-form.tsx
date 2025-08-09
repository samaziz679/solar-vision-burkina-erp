import { getSaleById } from "@/lib/data/sales"
import { getProducts } from "@/lib/data/products"
import { getClients } from "@/lib/data/clients"
import { SaleForm } from "./sale-form"

interface EditSaleFormProps {
  saleId: string
}

export async function EditSaleForm({ saleId }: EditSaleFormProps) {
  const { data: sale, error: saleError } = await getSaleById(saleId)
  const { data: products, error: productsError } = await getProducts()
  const { data: clients, error: clientsError } = await getClients()

  if (saleError) {
    return <div className="text-red-500">Error loading sale: {saleError.message}</div>
  }
  if (productsError) {
    return <div className="text-red-500">Error loading products: {productsError.message}</div>
  }
  if (clientsError) {
    return <div className="text-red-500">Error loading clients: {clientsError.message}</div>
  }

  if (!sale) {
    return <div className="text-red-500">Sale not found.</div>
  }
  if (!products || !clients) {
    return <div className="text-red-500">Failed to load necessary data for sale form.</div>
  }

  return <SaleForm defaultValues={sale} products={products} clients={clients} />
}

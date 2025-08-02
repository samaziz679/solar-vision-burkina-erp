import SaleForm from "@/components/sales/sale-form"
import { getProducts } from "@/lib/data/products" // To get products for selection
import { getClients } from "@/lib/data/clients" // Import getClients

export default async function NewSalePage() {
  const products = await getProducts()
  const clients = await getClients() // Fetch clients and pass to SaleForm

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Enregistrer une nouvelle vente</h1>
      <SaleForm products={products} clients={clients} /> {/* Pass products and clients */}
    </div>
  )
}

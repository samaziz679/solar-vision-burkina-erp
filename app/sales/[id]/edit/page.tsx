import { getSaleById } from "@/lib/data/sales" // Need to update getSaleById to fetch product and client details
import { getProducts } from "@/lib/data/products"
// import { getClients } from "@/lib/data/clients" // Will be created later
import EditSaleForm from "@/components/sales/edit-sale-form"
import { notFound } from "next/navigation"

interface EditSalePageProps {
  params: {
    id: string
  }
}

export default async function EditSalePage({ params }: EditSalePageProps) {
  const sale = await getSaleById(params.id)
  const products = await getProducts()
  // const clients = await getClients() // Uncomment when getClients is implemented

  if (!sale) {
    notFound() // Show 404 if sale not found
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Modifier Vente: {sale.products?.name || "Vente Inconnue"}</h1>
      <EditSaleForm sale={sale} products={products} /* clients={clients} */ />
    </div>
  )
}

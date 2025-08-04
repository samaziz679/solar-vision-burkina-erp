import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { getPurchaseById } from "@/lib/data/purchases"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"
import EditPurchaseForm from "@/components/purchases/edit-purchase-form"

export const dynamic = "force-dynamic"

export default async function EditPurchasePage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createServerClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.delete({ name, ...options })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const { purchase, error: purchaseError } = await getPurchaseById(params.id, user.id)
  const { products, error: productsError } = await getProducts(user.id)
  const { suppliers, error: suppliersError } = await getSuppliers(user.id)

  if (purchaseError || !purchase || productsError || !products || suppliersError || !suppliers) {
    console.error("Error fetching data for edit purchase page:", purchaseError || productsError || suppliersError)
    notFound()
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Modifier l&apos;Achat</h1>
      </div>
      <EditPurchaseForm purchase={purchase} products={products} suppliers={suppliers} />
    </main>
  )
}

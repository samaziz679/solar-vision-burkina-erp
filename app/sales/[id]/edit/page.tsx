import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { getSaleById } from "@/lib/data/sales"
import { getProducts } from "@/lib/data/products"
import { getClients } from "@/lib/data/clients"
import EditSaleForm from "@/components/sales/edit-sale-form"

export const dynamic = "force-dynamic"

export default async function EditSalePage({ params }: { params: { id: string } }) {
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

  const { sale, error: saleError } = await getSaleById(params.id, user.id)
  const { products, error: productsError } = await getProducts(user.id)
  const { clients, error: clientsError } = await getClients(user.id)

  if (saleError || !sale || productsError || !products || clientsError || !clients) {
    console.error("Error fetching data for edit sale page:", saleError || productsError || clientsError)
    notFound()
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Modifier la Vente</h1>
      </div>
      <EditSaleForm sale={sale} products={products} clients={clients} />
    </main>
  )
}

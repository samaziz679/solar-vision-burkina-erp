import { unstable_noStore as noStore } from 'next/cache';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function fetchCardData() {
  noStore();
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
        remove: (name: string, options: any) => cookieStore.delete(name, options),
      },
    }
  );

  try {
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select('total_amount');

    if (salesError) throw salesError;

    const { data: expensesData, error: expensesError } = await supabase
      .from('expenses')
      .select('amount');

    if (expensesError) throw expensesError;

    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('stock_quantity');

    if (productsError) throw productsError;

    const totalSales = salesData.reduce((sum, sale) => sum + sale.total_amount, 0);
    const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
    const totalProducts = productsData.reduce((sum, product) => sum + product.stock_quantity, 0);

    return {
      totalSales,
      totalExpenses,
      totalProducts,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

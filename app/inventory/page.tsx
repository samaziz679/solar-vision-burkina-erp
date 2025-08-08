import { fetchProducts } from '@/lib/data/products';
import ProductList from '@/components/inventory/product-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default async function InventoryPage() {
  const products = await fetchProducts();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Inventory</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button asChild className="ml-auto">
          <Link href="/inventory/new">Add New Product</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductList products={products} />
        </CardContent>
      </Card>
    </main>
  );
}

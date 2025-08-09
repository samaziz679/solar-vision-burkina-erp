-- This script makes the `user_id` columns NOT NULL and adds RLS policies.

-- AlterTable to make user_id NOT NULL
ALTER TABLE "clients" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "suppliers" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "sales" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "sale_items" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "purchases" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "purchase_items" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "expenses" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "banking" ALTER COLUMN "user_id" SET NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "suppliers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sales" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sale_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "purchases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "purchase_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "expenses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "banking" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'clients' table
CREATE POLICY "Users can view their own clients." ON "clients"
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own clients." ON "clients"
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clients." ON "clients"
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clients." ON "clients"
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for 'suppliers' table
CREATE POLICY "Users can view their own suppliers." ON "suppliers"
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own suppliers." ON "suppliers"
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own suppliers." ON "suppliers"
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own suppliers." ON "suppliers"
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for 'products' table
CREATE POLICY "Users can view their own products." ON "products"
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own products." ON "products"
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products." ON "products"
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products." ON "products"
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for 'sales' table
CREATE POLICY "Users can view their own sales." ON "sales"
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sales." ON "sales"
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sales." ON "sales"
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sales." ON "sales"
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for 'sale_items' table
CREATE POLICY "Users can view their own sale_items." ON "sale_items"
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sale_items." ON "sale_items"
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sale_items." ON "sale_items"
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sale_items." ON "sale_items"
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for 'purchases' table
CREATE POLICY "Users can view their own purchases." ON "purchases"
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own purchases." ON "purchases"
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own purchases." ON "purchases"
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own purchases." ON "purchases"
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for 'purchase_items' table
CREATE POLICY "Users can view their own purchase_items." ON "purchase_items"
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own purchase_items." ON "purchase_items"
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own purchase_items." ON "purchase_items"
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own purchase_items." ON "purchase_items"
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for 'expenses' table
CREATE POLICY "Users can view their own expenses." ON "expenses"
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own expenses." ON "expenses"
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses." ON "expenses"
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses." ON "expenses"
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for 'banking' table
CREATE POLICY "Users can view their own banking entries." ON "banking"
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own banking entries." ON "banking"
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own banking entries." ON "banking"
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own banking entries." ON "banking"
  FOR DELETE USING (auth.uid() = user_id);

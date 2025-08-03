-- This script contains the full schema for the Solar Vision Burkina ERP database.

-- Enable the "uuid-ossp" extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Users (from Supabase Auth)
-- This table is automatically managed by Supabase Auth.
-- We can add additional user metadata here if needed.
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name text,
    avatar_url text,
    billing_address text,
    shipping_address text,
    phone_number text,
    updated_at timestamp with time zone DEFAULT now()
);

-- RLS policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Table for Products (Inventory)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    description text,
    quantity integer NOT NULL DEFAULT 0,
    unit text,
    prix_achat numeric(10, 2) NOT NULL,
    prix_vente_detail_1 numeric(10, 2) NOT NULL,
    prix_vente_detail_2 numeric(10, 2) NOT NULL,
    prix_vente_gros numeric(10, 2) NOT NULL,
    type text,
    image text, -- URL to product image
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- RLS policies for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by authenticated users."
  ON public.products FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert products."
  ON public.products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products."
  ON public.products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products."
  ON public.products FOR DELETE
  USING (auth.role() = 'authenticated');

-- Table for Clients
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    contact_person text,
    email text,
    phone text,
    address text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- RLS policies for clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients are viewable by authenticated users."
  ON public.clients FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert clients."
  ON public.clients FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update clients."
  ON public.clients FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete clients."
  ON public.clients FOR DELETE
  USING (auth.role() = 'authenticated');

-- Table for Suppliers
CREATE TABLE IF NOT EXISTS public.suppliers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    contact_person text,
    email text,
    phone text,
    address text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- RLS policies for suppliers table
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Suppliers are viewable by authenticated users."
  ON public.suppliers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert suppliers."
  ON public.suppliers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update suppliers."
  ON public.suppliers FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete suppliers."
  ON public.suppliers FOR DELETE
  USING (auth.role() = 'authenticated');

-- Table for Sales
CREATE TABLE IF NOT EXISTS public.sales (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
    sale_date date NOT NULL DEFAULT now(),
    total_amount numeric(10, 2) NOT NULL,
    payment_status text NOT NULL DEFAULT 'Pending', -- e.g., 'Pending', 'Paid', 'Partially Paid'
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- RLS policies for sales table
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sales are viewable by authenticated users."
  ON public.sales FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sales."
  ON public.sales FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sales."
  ON public.sales FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sales."
  ON public.sales FOR DELETE
  USING (auth.role() = 'authenticated');

-- Table for Sale Items (linking products to sales)
CREATE TABLE IF NOT EXISTS public.sale_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id uuid REFERENCES public.sales(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    quantity integer NOT NULL,
    unit_price numeric(10, 2) NOT NULL,
    total_price numeric(10, 2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- RLS policies for sale_items table
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sale items are viewable by authenticated users."
  ON public.sale_items FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sale items."
  ON public.sale_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sale items."
  ON public.sale_items FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sale items."
  ON public.sale_items FOR DELETE
  USING (auth.role() = 'authenticated');

-- Table for Purchases (from suppliers)
CREATE TABLE IF NOT EXISTS public.purchases (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
    purchase_date date NOT NULL DEFAULT now(),
    total_amount numeric(10, 2) NOT NULL,
    payment_status text NOT NULL DEFAULT 'Pending', -- e.g., 'Pending', 'Paid', 'Partially Paid'
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- RLS policies for purchases table
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Purchases are viewable by authenticated users."
  ON public.purchases FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert purchases."
  ON public.purchases FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update purchases."
  ON public.purchases FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete purchases."
  ON public.purchases FOR DELETE
  USING (auth.role() = 'authenticated');

-- Table for Purchase Items (linking products to purchases)
CREATE TABLE IF NOT EXISTS public.purchase_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id uuid REFERENCES public.purchases(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    quantity integer NOT NULL,
    unit_price numeric(10, 2) NOT NULL,
    total_price numeric(10, 2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- RLS policies for purchase_items table
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Purchase items are viewable by authenticated users."
  ON public.purchase_items FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert purchase items."
  ON public.purchase_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update purchase items."
  ON public.purchase_items FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete purchase items."
  ON public.purchase_items FOR DELETE
  USING (auth.role() = 'authenticated');

-- Table for Expenses
CREATE TABLE IF NOT EXISTS public.expenses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_date date NOT NULL DEFAULT now(),
    amount numeric(10, 2) NOT NULL,
    description text NOT NULL,
    category text, -- e.g., 'Salaries', 'Rent', 'Utilities', 'Transport', 'Marketing', 'Maintenance', 'Other'
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- RLS policies for expenses table
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Expenses are viewable by authenticated users."
  ON public.expenses FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert expenses."
  ON public.expenses FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update expenses."
  ON public.expenses FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete expenses."
  ON public.expenses FOR DELETE
  USING (auth.role() = 'authenticated');

-- Table for Bank Entries (Deposits/Withdrawals)
CREATE TABLE IF NOT EXISTS public.bank_entries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    date date NOT NULL DEFAULT now(),
    type text NOT NULL, -- 'Dépôt' or 'Retrait'
    amount numeric(10, 2) NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- RLS policies for bank_entries table
ALTER TABLE public.bank_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bank entries are viewable by authenticated users."
  ON public.bank_entries FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert bank entries."
  ON public.bank_entries FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update bank entries."
  ON public.bank_entries FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete bank entries."
  ON public.bank_entries FOR DELETE
  USING (auth.role() = 'authenticated');

-- Set up trigger for updating `updated_at` column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to relevant tables
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_products_updated_at') THEN
        CREATE TRIGGER set_products_updated_at
        BEFORE UPDATE ON public.products
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_clients_updated_at') THEN
        CREATE TRIGGER set_clients_updated_at
        BEFORE UPDATE ON public.clients
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_suppliers_updated_at') THEN
        CREATE TRIGGER set_suppliers_updated_at
        BEFORE UPDATE ON public.suppliers
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_sales_updated_at') THEN
        CREATE TRIGGER set_sales_updated_at
        BEFORE UPDATE ON public.sales
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_sale_items_updated_at') THEN
        CREATE TRIGGER set_sale_items_updated_at
        BEFORE UPDATE ON public.sale_items
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_purchases_updated_at') THEN
        CREATE TRIGGER set_purchases_updated_at
        BEFORE UPDATE ON public.purchases
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_purchase_items_updated_at') THEN
        CREATE TRIGGER set_purchase_items_updated_at
        BEFORE UPDATE ON public.purchase_items
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_expenses_updated_at') THEN
        CREATE TRIGGER set_expenses_updated_at
        BEFORE UPDATE ON public.expenses
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_bank_entries_updated_at') THEN
        CREATE TRIGGER set_bank_entries_updated_at
        BEFORE UPDATE ON public.bank_entries
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Function to create a new profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user function on new user creation
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

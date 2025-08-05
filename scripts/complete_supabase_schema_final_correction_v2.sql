-- This script creates the complete Supabase schema for the Solar Vision ERP application.

-- Create the 'users' table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    email text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

-- Enable Row Level Security (RLS) for 'users' table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 'users' table
DROP POLICY IF EXISTS "Users can view their own user data." ON public.users;
CREATE POLICY "Users can view their own user data." ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own user data." ON public.users;
CREATE POLICY "Users can insert their own user data." ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own user data." ON public.users;
CREATE POLICY "Users can update their own user data." ON public.users FOR UPDATE USING (auth.uid() = id);
-- No DELETE policy for users, as user deletion is handled by auth.users CASCADE

-- Create the 'banking_accounts' table
CREATE TABLE IF NOT EXISTS public.banking_accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

-- Enable RLS for 'banking_accounts' table
ALTER TABLE public.banking_accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 'banking_accounts' table
DROP POLICY IF EXISTS "Users can view their own banking accounts." ON public.banking_accounts;
CREATE POLICY "Users can view their own banking accounts." ON public.banking_accounts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own banking accounts." ON public.banking_accounts;
CREATE POLICY "Users can insert their own banking accounts." ON public.banking_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own banking accounts." ON public.banking_accounts;
CREATE POLICY "Users can update their own banking accounts." ON public.banking_accounts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own banking accounts." ON public.banking_accounts;
CREATE POLICY "Users can delete their own banking accounts." ON public.banking_accounts FOR DELETE USING (auth.uid() = user_id);

-- Create 'transaction_type' enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE public.transaction_type AS ENUM ('income', 'expense', 'transfer');
    END IF;
END $$;

-- Create the 'banking_transactions' table
CREATE TABLE IF NOT EXISTS public.banking_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    account_id uuid REFERENCES public.banking_accounts ON DELETE CASCADE NOT NULL,
    type public.transaction_type NOT NULL,
    amount numeric NOT NULL,
    description text NOT NULL,
    date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

-- Enable RLS for 'banking_transactions' table
ALTER TABLE public.banking_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 'banking_transactions' table
DROP POLICY IF EXISTS "Users can view their own banking transactions." ON public.banking_transactions;
CREATE POLICY "Users can view their own banking transactions." ON public.banking_transactions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own banking transactions." ON public.banking_transactions;
CREATE POLICY "Users can insert their own banking transactions." ON public.banking_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own banking transactions." ON public.banking_transactions;
CREATE POLICY "Users can update their own banking transactions." ON public.banking_transactions FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own banking transactions." ON public.banking_transactions;
CREATE POLICY "Users can delete their own banking transactions." ON public.banking_transactions FOR DELETE USING (auth.uid() = user_id);

-- Create the 'clients' table
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    contact_person text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

-- Enable RLS for 'clients' table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 'clients' table
DROP POLICY IF EXISTS "Users can view their own clients." ON public.clients;
CREATE POLICY "Users can view their own clients." ON public.clients FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own clients." ON public.clients;
CREATE POLICY "Users can insert their own clients." ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own clients." ON public.clients;
CREATE POLICY "Users can update their own clients." ON public.clients FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own clients." ON public.clients;
CREATE POLICY "Users can delete their own clients." ON public.clients FOR DELETE USING (auth.uid() = user_id);

-- Create the 'expenses' table
CREATE TABLE IF NOT EXISTS public.expenses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    amount numeric NOT NULL,
    category text NOT NULL,
    description text NOT NULL,
    date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

-- Enable RLS for 'expenses' table
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 'expenses' table
DROP POLICY IF EXISTS "Users can view their own expenses." ON public.expenses;
CREATE POLICY "Users can view their own expenses." ON public.expenses FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own expenses." ON public.expenses;
CREATE POLICY "Users can insert their own expenses." ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own expenses." ON public.expenses;
CREATE POLICY "Users can update their own expenses." ON public.expenses FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own expenses." ON public.expenses;
CREATE POLICY "Users can delete their own expenses." ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- Create the 'products' table
CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    price numeric NOT NULL,
    stock integer NOT NULL,
    image_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

-- Enable RLS for 'products' table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 'products' table
DROP POLICY IF EXISTS "Users can view their own products." ON public.products;
CREATE POLICY "Users can view their own products." ON public.products FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own products." ON public.products;
CREATE POLICY "Users can insert their own products." ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own products." ON public.products;
CREATE POLICY "Users can update their own products." ON public.products FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own products." ON public.products;
CREATE POLICY "Users can delete their own products." ON public.products FOR DELETE USING (auth.uid() = user_id);

-- Create the 'purchases' table
CREATE TABLE IF NOT EXISTS public.purchases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products ON DELETE CASCADE NOT NULL,
    supplier_id uuid REFERENCES public.suppliers ON DELETE CASCADE NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric NOT NULL,
    purchase_date date NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

-- Enable RLS for 'purchases' table
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 'purchases' table
DROP POLICY IF EXISTS "Users can view their own purchases." ON public.purchases;
CREATE POLICY "Users can view their own purchases." ON public.purchases FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own purchases." ON public.purchases;
CREATE POLICY "Users can insert their own purchases." ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own purchases." ON public.purchases;
CREATE POLICY "Users can update their own purchases." ON public.purchases FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own purchases." ON public.purchases;
CREATE POLICY "Users can delete their own purchases." ON public.purchases FOR DELETE USING (auth.uid() = user_id);

-- Create the 'sales' table
CREATE TABLE IF NOT EXISTS public.sales (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products ON DELETE CASCADE NOT NULL,
    client_id uuid REFERENCES public.clients ON DELETE CASCADE NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric NOT NULL,
    sale_date date NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

-- Enable RLS for 'sales' table
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 'sales' table
DROP POLICY IF EXISTS "Users can view their own sales." ON public.sales;
CREATE POLICY "Users can view their own sales." ON public.sales FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own sales." ON public.sales;
CREATE POLICY "Users can insert their own sales." ON public.sales FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own sales." ON public.sales;
CREATE POLICY "Users can update their own sales." ON public.sales FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own sales." ON public.sales;
CREATE POLICY "Users can delete their own sales." ON public.sales FOR DELETE USING (auth.uid() = user_id);

-- Create the 'suppliers' table
CREATE TABLE IF NOT EXISTS public.suppliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    contact_person text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

-- Enable RLS for 'suppliers' table
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 'suppliers' table
DROP POLICY IF EXISTS "Users can view their own suppliers." ON public.suppliers;
CREATE POLICY "Users can view their own suppliers." ON public.suppliers FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own suppliers." ON public.suppliers;
CREATE POLICY "Users can insert their own suppliers." ON public.suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own suppliers." ON public.suppliers;
CREATE POLICY "Users can update their own suppliers." ON public.suppliers FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own suppliers." ON public.suppliers;
CREATE POLICY "Users can delete their own suppliers." ON public.suppliers FOR DELETE USING (auth.uid() = user_id);

-- Function to create a public.users entry on new auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user function on auth.users inserts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Set up Storage for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product_images', 'product_images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Create a policy for product_images bucket to allow authenticated users to upload and view
DROP POLICY IF EXISTS "Allow authenticated users to upload product images" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product_images' AND auth.uid() = (storage.foldername(name))[1]::uuid);

DROP POLICY IF EXISTS "Allow authenticated users to view product images" ON storage.objects;
CREATE POLICY "Allow authenticated users to view product images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'product_images' AND auth.uid() = (storage.foldername(name))[1]::uuid);

DROP POLICY IF EXISTS "Allow authenticated users to update product images" ON storage.objects;
CREATE POLICY "Allow authenticated users to update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product_images' AND auth.uid() = (storage.foldername(name))[1]::uuid);

DROP POLICY IF EXISTS "Allow authenticated users to delete product images" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product_images' AND auth.uid() = (storage.foldername(name))[1]::uuid);

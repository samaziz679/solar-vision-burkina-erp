-- This script is for setting up the complete Supabase schema.
-- It includes tables for users, banking accounts, transactions, clients,
-- expenses, products, suppliers, purchases, and sales.

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banking_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banking_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Drop existing tables if they exist (for clean setup)
-- Ensure the order of dropping tables respects foreign key constraints
DROP TABLE IF EXISTS public.sales CASCADE;
DROP TABLE IF EXISTS public.purchases CASCADE;
DROP TABLE IF EXISTS public.banking_transactions CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.banking_accounts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop enums if they exist
DROP TYPE IF EXISTS public.transaction_type;

-- Create ENUM for transaction types
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense', 'transfer');

-- Create users table
CREATE TABLE public.users (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create banking_accounts table
CREATE TABLE public.banking_accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create banking_transactions table
CREATE TABLE public.banking_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    account_id uuid REFERENCES public.banking_accounts(id) ON DELETE CASCADE NOT NULL,
    type transaction_type NOT NULL,
    amount numeric(10, 2) NOT NULL,
    description text NOT NULL,
    date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create clients table
CREATE TABLE public.clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    contact_person text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create expenses table
CREATE TABLE public.expenses (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    description text NOT NULL,
    amount numeric(10, 2) NOT NULL,
    date date NOT NULL,
    category text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create products table
CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price numeric(10, 2) NOT NULL,
    stock integer NOT NULL,
    category text NOT NULL,
    image_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create suppliers table
CREATE TABLE public.suppliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    contact_person text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create purchases table
CREATE TABLE public.purchases (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    supplier_id uuid REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10, 2) NOT NULL,
    purchase_date date NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create sales table
CREATE TABLE public.sales (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10, 2) NOT NULL,
    sale_date date NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS Policies for users table
CREATE POLICY "Allow all authenticated users to view their own user data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow authenticated users to insert their own user data" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow authenticated users to update their own user data" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow authenticated users to delete their own user data" ON public.users FOR DELETE USING (auth.uid() = id);

-- RLS Policies for banking_accounts table
CREATE POLICY "Allow all authenticated users to view their own banking accounts" ON public.banking_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to insert their own banking accounts" ON public.banking_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to update their own banking accounts" ON public.banking_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to delete their own banking accounts" ON public.banking_accounts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for banking_transactions table
CREATE POLICY "Allow all authenticated users to view their own banking transactions" ON public.banking_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to insert their own banking transactions" ON public.banking_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to update their own banking transactions" ON public.banking_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to delete their own banking transactions" ON public.banking_transactions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for clients table
CREATE POLICY "Allow all authenticated users to view their own clients" ON public.clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to insert their own clients" ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to update their own clients" ON public.clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to delete their own clients" ON public.clients FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for expenses table
CREATE POLICY "Allow all authenticated users to view their own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to insert their own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to update their own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to delete their own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for products table
CREATE POLICY "Allow all authenticated users to view their own products" ON public.products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to insert their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to update their own products" ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to delete their own products" ON public.products FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for suppliers table
CREATE POLICY "Allow all authenticated users to view their own suppliers" ON public.suppliers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to insert their own suppliers" ON public.suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to update their own suppliers" ON public.suppliers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to delete their own suppliers" ON public.suppliers FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for purchases table
CREATE POLICY "Allow all authenticated users to view their own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to insert their own purchases" ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to update their own purchases" ON public.purchases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to delete their own purchases" ON public.purchases FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for sales table
CREATE POLICY "Allow all authenticated users to view their own sales" ON public.sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to insert their own sales" ON public.sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to update their own sales" ON public.sales FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to delete their own sales" ON public.sales FOR DELETE USING (auth.uid() = user_id);

-- Function to create a public.users entry on new auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

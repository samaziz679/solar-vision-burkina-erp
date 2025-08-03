-- This script sets up the full Supabase schema for the Solar Vision Burkina ERP.
-- It includes tables for products, sales, purchases, expenses, banking accounts, clients, and suppliers.
-- It also sets up Row Level Security (RLS) policies to ensure data is secure and accessible only by the owning user.

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE banking_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create the 'products' table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    image_url TEXT -- Added for product images
);

-- RLS policies for 'products' table
CREATE POLICY "Users can view their own products." ON products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products." ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products." ON products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products." ON products
  FOR DELETE USING (auth.uid() = user_id);

-- Create the 'clients' table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    address TEXT NOT NULL
);

-- RLS policies for 'clients' table
CREATE POLICY "Users can view their own clients." ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients." ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients." ON clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients." ON clients
  FOR DELETE USING (auth.uid() = user_id);

-- Create the 'suppliers' table
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    address TEXT NOT NULL
);

-- RLS policies for 'suppliers' table
CREATE POLICY "Users can view their own suppliers." ON suppliers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suppliers." ON suppliers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers." ON suppliers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers." ON suppliers
  FOR DELETE USING (auth.uid() = user_id);

-- Create the 'sales' table
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT NOT NULL, -- RESTRICT to prevent deleting products with sales
    client_id UUID REFERENCES clients(id) ON DELETE RESTRICT NOT NULL,   -- RESTRICT to prevent deleting clients with sales
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    sale_date DATE NOT NULL
);

-- RLS policies for 'sales' table
CREATE POLICY "Users can view their own sales." ON sales
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sales." ON sales
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales." ON sales
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales." ON sales
  FOR DELETE USING (auth.uid() = user_id);

-- Create the 'purchases' table
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT NOT NULL, -- RESTRICT to prevent deleting products with purchases
    supplier_id UUID REFERENCES suppliers(id) ON DELETE RESTRICT NOT NULL, -- RESTRICT to prevent deleting suppliers with purchases
    quantity INTEGER NOT NULL,
    unit_cost NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    purchase_date DATE NOT NULL
);

-- RLS policies for 'purchases' table
CREATE POLICY "Users can view their own purchases." ON purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases." ON purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchases." ON purchases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own purchases." ON purchases
  FOR DELETE USING (auth.uid() = user_id);

-- Create the 'expenses' table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL
);

-- RLS policies for 'expenses' table
CREATE POLICY "Users can view their own expenses." ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses." ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses." ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses." ON expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Create the 'banking_accounts' table
CREATE TABLE banking_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    balance NUMERIC(10, 2) NOT NULL DEFAULT 0
);

-- RLS policies for 'banking_accounts' table
CREATE POLICY "Users can view their own banking accounts." ON banking_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own banking accounts." ON banking_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own banking accounts." ON banking_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own banking accounts." ON banking_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Create the 'user_profiles' table to store additional user information
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    is_admin BOOLEAN DEFAULT FALSE
);

-- RLS policies for 'user_profiles' table
CREATE POLICY "Users can view their own profile." ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user profiles." ON user_profiles
  FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Users can insert their own profile." ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile." ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any user profile." ON user_profiles
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE));

-- Function to create a user profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, is_admin)
  VALUES (NEW.id, FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

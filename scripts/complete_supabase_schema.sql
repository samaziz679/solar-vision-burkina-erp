-- This script sets up the complete schema for the Solar Vision Burkina ERP application in Supabase.

-- Create ENUM for transaction types
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- Create 'users' table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL,

    CONSTRAINT users_email_key UNIQUE (email)
);

-- Create 'products' table
CREATE TABLE products (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    cost_price DOUBLE PRECISION NOT NULL,
    selling_price DOUBLE PRECISION NOT NULL,
    quantity_in_stock INT NOT NULL DEFAULT 0,
    image_url TEXT -- Added image_url column
);

-- Create 'clients' table
CREATE TABLE clients (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(255) NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT
);

-- Create 'suppliers' table
CREATE TABLE suppliers (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(255) NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT
);

-- Create 'sales' table
CREATE TABLE sales (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    client_id TEXT REFERENCES public.clients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity INT NOT NULL,
    total_price DOUBLE PRECISION NOT NULL,
    sale_date TIMESTAMP(3) NOT NULL
);

-- Create 'purchases' table
CREATE TABLE purchases (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    supplier_id TEXT REFERENCES public.suppliers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity INT NOT NULL,
    total_cost DOUBLE PRECISION NOT NULL,
    purchase_date TIMESTAMP(3) NOT NULL
);

-- Create 'expenses' table
CREATE TABLE expenses (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    date DATE NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    category VARCHAR(255),
    description TEXT
);

-- Create 'banking_transactions' table
CREATE TABLE banking_transactions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    type transaction_type NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    description TEXT
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE banking_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 'users' table
CREATE POLICY "Users can view their own user data." ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own user data." ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own user data." ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete their own user data." ON users FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for 'products' table
CREATE POLICY "Users can view their own products." ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own products." ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products." ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products." ON products FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for 'clients' table
CREATE POLICY "Users can view their own clients." ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own clients." ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clients." ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clients." ON clients FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for 'suppliers' table
CREATE POLICY "Users can view their own suppliers." ON suppliers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own suppliers." ON suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own suppliers." ON suppliers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own suppliers." ON suppliers FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for 'sales' table
CREATE POLICY "Users can view their own sales." ON sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sales." ON sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sales." ON sales FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sales." ON sales FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for 'purchases' table
CREATE POLICY "Users can view their own purchases." ON purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own purchases." ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own purchases." ON purchases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own purchases." ON purchases FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for 'expenses' table
CREATE POLICY "Users can view their own expenses." ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own expenses." ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses." ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses." ON expenses FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for 'banking_transactions' table
CREATE POLICY "Users can view their own banking transactions." ON banking_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own banking transactions." ON banking_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own banking transactions." ON banking_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own banking transactions." ON banking_transactions FOR DELETE USING (auth.uid() = user_id);

-- Function to create a public.users entry when a new auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user function on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

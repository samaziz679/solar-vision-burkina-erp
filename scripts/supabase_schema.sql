-- This script sets up the basic database schema for the Solar Vision Burkina ERP system.

-- Enable the "uuid-ossp" extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the "public" schema if it doesn't exist (usually exists by default)
CREATE SCHEMA IF NOT EXISTS public;

-- Set the search path to "public"
SET search_path TO public;

-- Drop tables if they exist to ensure a clean slate for schema creation
DROP TABLE IF EXISTS sales_items CASCADE;
DROP TABLE IF EXISTS purchase_items CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS banking_transactions CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create the "profiles" table to store user profiles
CREATE TABLE profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for the "profiles" table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the "profiles" table
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete their own profile." ON profiles FOR DELETE USING (auth.uid() = id);

-- Create the "clients" table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for the "clients" table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the "clients" table
CREATE POLICY "Clients are viewable by authenticated users." ON clients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create clients." ON clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update clients." ON clients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete clients." ON clients FOR DELETE USING (auth.role() = 'authenticated');

-- Create the "suppliers" table
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for the "suppliers" table
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the "suppliers" table
CREATE POLICY "Suppliers are viewable by authenticated users." ON suppliers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create suppliers." ON suppliers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update suppliers." ON suppliers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete suppliers." ON suppliers FOR DELETE USING (auth.role() = 'authenticated');

-- Create the "products" table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for the "products" table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the "products" table
CREATE POLICY "Products are viewable by authenticated users." ON products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create products." ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update products." ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete products." ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Create the "purchases" table
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    purchase_date DATE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for the "purchases" table
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the "purchases" table
CREATE POLICY "Purchases are viewable by authenticated users." ON purchases FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create purchases." ON purchases FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update purchases." ON purchases FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete purchases." ON purchases FOR DELETE USING (auth.role() = 'authenticated');

-- Create the "purchase_items" table
CREATE TABLE purchase_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for the "purchase_items" table
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the "purchase_items" table
CREATE POLICY "Purchase items are viewable by authenticated users." ON purchase_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create purchase items." ON purchase_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update purchase items." ON purchase_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete purchase items." ON purchase_items FOR DELETE USING (auth.role() = 'authenticated');

-- Create the "sales" table
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    sale_date DATE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for the "sales" table
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the "sales" table
CREATE POLICY "Sales are viewable by authenticated users." ON sales FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create sales." ON sales FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update sales." ON sales FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete sales." ON sales FOR DELETE USING (auth.role() = 'authenticated');

-- Create the "sales_items" table
CREATE TABLE sales_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for the "sales_items" table
ALTER TABLE sales_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the "sales_items" table
CREATE POLICY "Sales items are viewable by authenticated users." ON sales_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create sales items." ON sales_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update sales items." ON sales_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete sales items." ON sales_items FOR DELETE USING (auth.role() = 'authenticated');

-- Create the "expenses" table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for the "expenses" table
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the "expenses" table
CREATE POLICY "Expenses are viewable by authenticated users." ON expenses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create expenses." ON expenses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update expenses." ON expenses FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete expenses." ON expenses FOR DELETE USING (auth.role() = 'authenticated');

-- Create the "banking_transactions" table
CREATE TABLE banking_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_date DATE NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'deposit', 'withdrawal', 'transfer'
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for the "banking_transactions" table
ALTER TABLE banking_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the "banking_transactions" table
CREATE POLICY "Banking transactions are viewable by authenticated users." ON banking_transactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create banking transactions." ON banking_transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update banking transactions." ON banking_transactions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete banking transactions." ON banking_transactions FOR DELETE USING (auth.role() = 'authenticated');

-- Set up a trigger to update `updated_at` column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables that have an `updated_at` column
DO $$
DECLARE
    t_name TEXT;
BEGIN
    FOR t_name IN (SELECT table_name FROM information_schema.columns WHERE column_name = 'updated_at' AND table_schema = 'public')
    LOOP
        EXECUTE FORMAT('CREATE OR REPLACE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', t_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Optional: Add indexes for performance on frequently queried columns
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_suppliers_name ON suppliers(name);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_purchases_date ON purchases(purchase_date);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_banking_transactions_date ON banking_transactions(transaction_date);

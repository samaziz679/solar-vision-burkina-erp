-- This script sets up the complete schema for the Solar Vision Burkina ERP application in Supabase.

-- Enable the "uuid-ossp" extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the "users" table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the "products" table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    cost_price NUMERIC(10, 2) NOT NULL,
    selling_price NUMERIC(10, 2) NOT NULL,
    quantity_in_stock INT NOT NULL DEFAULT 0,
    image_url TEXT,
    supplier_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the "clients" table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the "suppliers" table
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the "sales" table
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT, -- RESTRICT to prevent deleting clients with existing sales
    sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the "sale_items" table
CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE RESTRICT, -- RESTRICT to prevent deleting sales with existing items
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT, -- RESTRICT to prevent deleting products with existing items
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the "purchases" table
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT, -- RESTRICT to prevent deleting suppliers with existing purchases
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the "purchase_items" table
CREATE TABLE purchase_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE RESTRICT, -- RESTRICT to prevent deleting purchases with existing items
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT, -- RESTRICT to prevent deleting products with existing items
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the "expenses" table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    category TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the "banking" table
CREATE TABLE banking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    balance NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an ENUM type for banking transaction types
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- Create the "banking_transactions" table
CREATE TABLE banking_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    type transaction_type NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE banking ENABLE ROW LEVEL SECURITY;
ALTER TABLE banking_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for "users" table
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);

-- Policies for "products" table
CREATE POLICY "Allow read access to products for authenticated users" ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow insert access to products for authenticated users" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow update access to products for authenticated users" ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow delete access to products for authenticated users" ON products FOR DELETE USING (auth.uid() = user_id);

-- Policies for "clients" table
CREATE POLICY "Allow read access to clients for authenticated users" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow insert access to clients for authenticated users" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow update access to clients for authenticated users" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow delete access to clients for authenticated users" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Policies for "suppliers" table
CREATE POLICY "Allow read access to suppliers for authenticated users" ON suppliers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow insert access to suppliers for authenticated users" ON suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow update access to suppliers for authenticated users" ON suppliers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow delete access to suppliers for authenticated users" ON suppliers FOR DELETE USING (auth.uid() = user_id);

-- Policies for "sales" table
CREATE POLICY "Allow read access to sales for authenticated users" ON sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow insert access to sales for authenticated users" ON sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow update access to sales for authenticated users" ON sales FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow delete access to sales for authenticated users" ON sales FOR DELETE USING (auth.uid() = user_id);

-- Policies for "sale_items" table
CREATE POLICY "Allow read access to sale_items for authenticated users" ON sale_items FOR SELECT USING (auth.uid() = (SELECT user_id FROM sales WHERE id = sale_items.sale_id));
CREATE POLICY "Allow insert access to sale_items for authenticated users" ON sale_items FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM sales WHERE id = sale_items.sale_id));
CREATE POLICY "Allow update access to sale_items for authenticated users" ON sale_items FOR UPDATE USING (auth.uid() = (SELECT user_id FROM sales WHERE id = sale_items.sale_id));
CREATE POLICY "Allow delete access to sale_items for authenticated users" ON sale_items FOR DELETE USING (auth.uid() = (SELECT user_id FROM sales WHERE id = sale_items.sale_id));

-- Policies for "purchases" table
CREATE POLICY "Allow read access to purchases for authenticated users" ON purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow insert access to purchases for authenticated users" ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow update access to purchases for authenticated users" ON purchases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow delete access to purchases for authenticated users" ON purchases FOR DELETE USING (auth.uid() = user_id);

-- Policies for "purchase_items" table
CREATE POLICY "Allow read access to purchase_items for authenticated users" ON purchase_items FOR SELECT USING (auth.uid() = (SELECT user_id FROM purchases WHERE id = purchase_items.purchase_id));
CREATE POLICY "Allow insert access to purchase_items for authenticated users" ON purchase_items FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM purchases WHERE id = purchase_items.purchase_id));
CREATE POLICY "Allow update access to purchase_items for authenticated users" ON purchase_items FOR UPDATE USING (auth.uid() = (SELECT user_id FROM purchases WHERE id = purchase_items.purchase_id));
CREATE POLICY "Allow delete access to purchase_items for authenticated users" ON purchase_items FOR DELETE USING (auth.uid() = (SELECT user_id FROM purchases WHERE id = purchase_items.purchase_id));

-- Policies for "expenses" table
CREATE POLICY "Allow read access to expenses for authenticated users" ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow insert access to expenses for authenticated users" ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow update access to expenses for authenticated users" ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow delete access to expenses for authenticated users" ON expenses FOR DELETE USING (auth.uid() = user_id);

-- Policies for "banking" table
CREATE POLICY "Allow read access to banking for authenticated users" ON banking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow insert access to banking for authenticated users" ON banking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow update access to banking for authenticated users" ON banking FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow delete access to banking for authenticated users" ON banking FOR DELETE USING (auth.uid() = user_id);

-- Policies for "banking_transactions" table
CREATE POLICY "Allow read access to banking_transactions for authenticated users" ON banking_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow insert access to banking_transactions for authenticated users" ON banking_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow update access to banking_transactions for authenticated users" ON banking_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow delete access to banking_transactions for authenticated users" ON banking_transactions FOR DELETE USING (auth.uid() = user_id);

-- Function to update `updated_at` column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for `updated_at` column on relevant tables
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
BEFORE UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sale_items_updated_at
BEFORE UPDATE ON sale_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at
BEFORE UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_items_updated_at
BEFORE UPDATE ON purchase_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banking_updated_at
BEFORE UPDATE ON banking
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banking_transactions_updated_at
BEFORE UPDATE ON banking_transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

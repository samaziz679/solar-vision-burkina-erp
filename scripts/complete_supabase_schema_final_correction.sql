-- Ensure extensions are created first
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'stock_manager', 'commercial', 'finance', 'visitor', 'seller');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_category') THEN
        CREATE TYPE expense_category AS ENUM ('salaire', 'loyer', 'emprunt', 'electricite', 'eau', 'internet', 'carburant', 'maintenance', 'autre');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'price_plan') THEN
        CREATE TYPE price_plan AS ENUM ('detail_1', 'detail_2', 'gros');
    END IF;
END $$;

-- Tables creation (using IF NOT EXISTS for idempotence)
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    quantity INTEGER DEFAULT 0,
    prix_achat DECIMAL(10,2) DEFAULT 0,
    prix_vente_detail_1 DECIMAL(10,2) DEFAULT 0,
    prix_vente_detail_2 DECIMAL(10,2) DEFAULT 0,
    prix_vente_gros DECIMAL(10,2) DEFAULT 0,
    seuil_stock_bas INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price_plan price_plan NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    category expense_category NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS bank_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_type VARCHAR(50) NOT NULL, -- 'mobile' or 'bank'
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL, -- positive for credit, negative for debit
    entry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS stock_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'purchase', 'sale', 'adjustment', 'price_change'
    quantity_before INTEGER,
    quantity_after INTEGER,
    price_before DECIMAL(10,2),
    price_after DECIMAL(10,2),
    reference_id UUID, -- ID of the related sale/purchase
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    notes TEXT
);

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check user roles (moved to public schema)
CREATE OR REPLACE FUNCTION public.user_has_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has any of the specified roles (moved to public schema)
CREATE OR REPLACE FUNCTION public.user_has_any_role(required_roles user_role[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = ANY(required_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies (with explicit type casting for arrays)
-- User roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
CREATE POLICY "Users can view their own roles" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all user roles" ON user_roles;
CREATE POLICY "Admins can manage all user roles" ON user_roles
    FOR ALL USING (public.user_has_role('admin'::user_role));

-- Products policies
DROP POLICY IF EXISTS "All authenticated users can view products" ON products;
CREATE POLICY "All authenticated users can view products" ON products
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Stock managers and admins can manage products" ON products;
CREATE POLICY "Stock managers and admins can manage products" ON products
    FOR ALL USING (public.user_has_any_role(ARRAY['admin', 'stock_manager']::user_role[]));

-- Clients policies
DROP POLICY IF EXISTS "Users can view clients based on role" ON clients;
CREATE POLICY "Users can view clients based on role" ON clients
    FOR SELECT USING (public.user_has_any_role(ARRAY['admin', 'commercial', 'seller', 'visitor']::user_role[]));

DROP POLICY IF EXISTS "Commercial and admins can manage clients" ON clients;
CREATE POLICY "Commercial and admins can manage clients" ON clients
    FOR ALL USING (public.user_has_any_role(ARRAY['admin', 'commercial']::user_role[]));

-- Suppliers policies
DROP POLICY IF EXISTS "Users can view suppliers based on role" ON suppliers;
CREATE POLICY "Users can view suppliers based on role" ON suppliers
    FOR SELECT USING (public.user_has_any_role(ARRAY['admin', 'stock_manager', 'visitor']::user_role[]));

DROP POLICY IF EXISTS "Stock managers and admins can manage suppliers" ON suppliers;
CREATE POLICY "Stock managers and admins can manage suppliers" ON suppliers
    FOR ALL USING (public.user_has_any_role(ARRAY['admin', 'stock_manager']::user_role[]));

-- Sales policies
DROP POLICY IF EXISTS "Users can view sales based on role" ON sales;
CREATE POLICY "Users can view sales based on role" ON sales
    FOR SELECT USING (public.user_has_any_role(ARRAY['admin', 'commercial', 'seller', 'visitor']::user_role[]));

DROP POLICY IF EXISTS "Commercial and sellers can create sales" ON sales;
CREATE POLICY "Commercial and sellers can create sales" ON sales
    FOR INSERT WITH CHECK (public.user_has_any_role(ARRAY['admin', 'commercial', 'seller']::user_role[]));

DROP POLICY IF EXISTS "Commercial and admins can update sales" ON sales;
CREATE POLICY "Commercial and admins can update sales" ON sales
    FOR UPDATE USING (public.user_has_any_role(ARRAY['admin', 'commercial']::user_role[]));

-- Purchases policies
DROP POLICY IF EXISTS "Users can view purchases based on role" ON purchases;
CREATE POLICY "Users can view purchases based on role" ON purchases
    FOR SELECT USING (public.user_has_any_role(ARRAY['admin', 'stock_manager', 'visitor']::user_role[]));

DROP POLICY IF EXISTS "Stock managers and admins can manage purchases" ON purchases;
CREATE POLICY "Stock managers and admins can manage purchases" ON purchases
    FOR ALL USING (public.user_has_any_role(ARRAY['admin', 'stock_manager']::user_role[]));

-- Expenses policies
DROP POLICY IF EXISTS "Finance and admins can view expenses" ON expenses;
CREATE POLICY "Finance and admins can view expenses" ON expenses
    FOR SELECT USING (public.user_has_any_role(ARRAY['admin', 'finance', 'visitor']::user_role[]));

DROP POLICY IF EXISTS "Finance and admins can manage expenses" ON expenses;
CREATE POLICY "Finance and admins can manage expenses" ON expenses
    FOR ALL USING (public.user_has_any_role(ARRAY['admin', 'finance']::user_role[]));

-- Bank entries policies
DROP POLICY IF EXISTS "Finance and admins can view bank entries" ON bank_entries;
CREATE POLICY "Finance and admins can view bank entries" ON bank_entries
    FOR SELECT USING (public.user_has_any_role(ARRAY['admin', 'finance', 'visitor']::user_role[]));

DROP POLICY IF EXISTS "Finance and admins can manage bank entries" ON bank_entries;
CREATE POLICY "Finance and admins can manage bank entries" ON bank_entries
    FOR ALL USING (public.user_has_any_role(ARRAY['admin', 'finance']::user_role[]));

-- Stock logs policies
DROP POLICY IF EXISTS "All authenticated users can view stock logs" ON stock_logs;
CREATE POLICY "All authenticated users can view stock logs" ON stock_logs
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "System can insert stock logs" ON stock_logs;
CREATE POLICY "System can insert stock logs" ON stock_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create indexes for better performance (using IF NOT EXISTS for idempotence)
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_quantity ON products(quantity);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_created_by ON sales(created_by);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_stock_logs_product_id ON stock_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_logs_created_at ON stock_logs(created_at);

-- Insert initial stock data (from Stock-ouverture-ok.csv)
-- TRUNCATE TABLE products RESTART IDENTITY CASCADE; -- Only uncomment if you want to clear existing products

INSERT INTO products (name, type, quantity, prix_achat, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros, seuil_stock_bas) VALUES
('Raggie 20AH Controller', 'Controller de charge', 80, 0, 8500, 9000, 7500, 10),
('Panneau Solaire 150W', 'Panneau Solaire', 50, 0, 75000, 72000, 68000, 10),
('Batterie Gel 200AH', 'Batterie', 30, 0, 120000, 115000, 110000, 10),
('Onduleur Hybride 3KW', 'Onduleur', 15, 0, 250000, 240000, 230000, 10),
('Cable Solaire 6mm', 'Cable', 200, 0, 2500, 2200, 2000, 10),
('Support Panneau', 'Support', 100, 0, 15000, 14000, 13000, 10),
('Pompe Solaire 1HP', 'Pompe', 5, 0, 180000, 170000, 160000, 2),
('Lampe Solaire 10W', 'Eclairage', 150, 0, 12000, 11000, 10000, 20),
('Chargeur Solaire USB', 'Accessoire', 120, 0, 5000, 4500, 4000, 15),
('Ventilateur Solaire', 'Ventilateur', 40, 0, 35000, 32000, 30000, 5);

-- Insert some sample data for clients and suppliers (if not already present)
INSERT INTO clients (name, phone, email, address) VALUES
('Ouagadougou Solar SARL', '+226 70 12 34 56', 'contact@ouagasolar.bf', 'Secteur 15, Ouagadougou') ON CONFLICT (name) DO NOTHING,
('Bobo Energy', '+226 76 98 76 54', 'info@boboenergy.bf', 'Bobo-Dioulasso') ON CONFLICT (name) DO NOTHING,
('Koudougou Electric', '+226 78 45 67 89', 'koudougou@electric.bf', 'Koudougou') ON CONFLICT (name) DO NOTHING;

INSERT INTO suppliers (name, phone, email, address) VALUES
('Solar Tech Import', '+226 25 30 40 50', 'import@solartech.bf', 'Zone Industrielle, Ouagadougou') ON CONFLICT (name) DO NOTHING,
('West Africa Solar', '+226 25 60 70 80', 'sales@wasolar.com', 'Abidjan, Côte d''Ivoire') ON CONFLICT (name) DO NOTHING,
('Burkina Energy Supply', '+226 25 90 10 20', 'supply@burkinaenergy.bf', 'Ouagadougou') ON CONFLICT (name) DO NOTHING;

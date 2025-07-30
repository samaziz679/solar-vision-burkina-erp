-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'stock_manager', 'commercial', 'finance', 'visitor', 'seller');
CREATE TYPE expense_category AS ENUM ('salaire', 'loyer', 'emprunt', 'electricite', 'eau', 'internet', 'carburant', 'maintenance', 'autre');
CREATE TYPE price_plan AS ENUM ('detail_1', 'detail_2', 'gros');

-- User roles table (many-to-many relationship)
CREATE TABLE user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id, role)
);

-- Products table
CREATE TABLE products (
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

-- Clients table
CREATE TABLE clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Suppliers table
CREATE TABLE suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Sales table
CREATE TABLE sales (
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

-- Purchases table
CREATE TABLE purchases (
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

-- Expenses table
CREATE TABLE expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    category expense_category NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    notes TEXT
);

-- Bank entries table
CREATE TABLE bank_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_type VARCHAR(50) NOT NULL, -- 'mobile' or 'bank'
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL, -- positive for credit, negative for debit
    entry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    notes TEXT
);

-- Stock logs table (for tracking changes)
CREATE TABLE stock_logs (
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

-- Helper function to check user roles
CREATE OR REPLACE FUNCTION auth.user_has_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has any of the specified roles
CREATE OR REPLACE FUNCTION auth.user_has_any_role(required_roles user_role[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = ANY(required_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
-- User roles policies
CREATE POLICY "Users can view their own roles" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user roles" ON user_roles
    FOR ALL USING (auth.user_has_role('admin'));

-- Products policies
CREATE POLICY "All authenticated users can view products" ON products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Stock managers and admins can manage products" ON products
    FOR ALL USING (auth.user_has_any_role(ARRAY['admin', 'stock_manager']));

-- Clients policies
CREATE POLICY "Users can view clients based on role" ON clients
    FOR SELECT USING (auth.user_has_any_role(ARRAY['admin', 'commercial', 'seller', 'visitor']));

CREATE POLICY "Commercial and admins can manage clients" ON clients
    FOR ALL USING (auth.user_has_any_role(ARRAY['admin', 'commercial']));

-- Suppliers policies
CREATE POLICY "Users can view suppliers based on role" ON suppliers
    FOR SELECT USING (auth.user_has_any_role(ARRAY['admin', 'stock_manager', 'visitor']));

CREATE POLICY "Stock managers and admins can manage suppliers" ON suppliers
    FOR ALL USING (auth.user_has_any_role(ARRAY['admin', 'stock_manager']));

-- Sales policies
CREATE POLICY "Users can view sales based on role" ON sales
    FOR SELECT USING (auth.user_has_any_role(ARRAY['admin', 'commercial', 'seller', 'visitor']));

CREATE POLICY "Commercial and sellers can create sales" ON sales
    FOR INSERT WITH CHECK (auth.user_has_any_role(ARRAY['admin', 'commercial', 'seller']));

CREATE POLICY "Commercial and admins can update sales" ON sales
    FOR UPDATE USING (auth.user_has_any_role(ARRAY['admin', 'commercial']));

-- Purchases policies
CREATE POLICY "Users can view purchases based on role" ON purchases
    FOR SELECT USING (auth.user_has_any_role(ARRAY['admin', 'stock_manager', 'visitor']));

CREATE POLICY "Stock managers and admins can manage purchases" ON purchases
    FOR ALL USING (auth.user_has_any_role(ARRAY['admin', 'stock_manager']));

-- Expenses policies
CREATE POLICY "Finance and admins can view expenses" ON expenses
    FOR SELECT USING (auth.user_has_any_role(ARRAY['admin', 'finance', 'visitor']));

CREATE POLICY "Finance and admins can manage expenses" ON expenses
    FOR ALL USING (auth.user_has_any_role(ARRAY['admin', 'finance']));

-- Bank entries policies
CREATE POLICY "Finance and admins can view bank entries" ON bank_entries
    FOR SELECT USING (auth.user_has_any_role(ARRAY['admin', 'finance', 'visitor']));

CREATE POLICY "Finance and admins can manage bank entries" ON bank_entries
    FOR ALL USING (auth.user_has_any_role(ARRAY['admin', 'finance']));

-- Stock logs policies
CREATE POLICY "All authenticated users can view stock logs" ON stock_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert stock logs" ON stock_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_quantity ON products(quantity);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_created_by ON sales(created_by);
CREATE INDEX idx_purchases_date ON purchases(purchase_date);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_stock_logs_product_id ON stock_logs(product_id);
CREATE INDEX idx_stock_logs_created_at ON stock_logs(created_at);

-- Insert some sample data for testing
INSERT INTO products (name, type, quantity, prix_achat, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros, seuil_stock_bas) VALUES
('Panneau Solaire 100W', 'Panneau', 50, 45000, 55000, 52000, 48000, 5),
('Batterie 12V 100Ah', 'Batterie', 30, 85000, 105000, 100000, 95000, 3),
('Régulateur MPPT 30A', 'Régulateur', 25, 25000, 32000, 30000, 28000, 5),
('Onduleur 1000W', 'Onduleur', 15, 65000, 85000, 80000, 75000, 2),
('Câble Solaire 4mm²', 'Accessoire', 100, 1500, 2000, 1800, 1600, 10);

INSERT INTO clients (name, phone, email, address) VALUES
('Ouagadougou Solar SARL', '+226 70 12 34 56', 'contact@ouagasolar.bf', 'Secteur 15, Ouagadougou'),
('Bobo Energy', '+226 76 98 76 54', 'info@boboenergy.bf', 'Bobo-Dioulasso'),
('Koudougou Electric', '+226 78 45 67 89', 'koudougou@electric.bf', 'Koudougou');

INSERT INTO suppliers (name, phone, email, address) VALUES
('Solar Tech Import', '+226 25 30 40 50', 'import@solartech.bf', 'Zone Industrielle, Ouagadougou'),
('West Africa Solar', '+226 25 60 70 80', 'sales@wasolar.com', 'Abidjan, Côte d''Ivoire'),
('Burkina Energy Supply', '+226 25 90 10 20', 'supply@burkinaenergy.bf', 'Ouagadougou');

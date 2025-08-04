-- Corrected script for inserting initial stock and related data.
-- This script assumes the schema is already created and correct.
-- Ensure 'user_abc' exists in the 'users' table or replace with an actual user ID.

-- Insert Products
DO $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Attempt to get an existing user ID
    SELECT id INTO user_uuid FROM auth.users LIMIT 1;

    -- If no user exists, you might want to handle this (e.g., raise an error or insert a dummy user)
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'No user found in auth.users. Please create a user first or replace the UUID manually.';
    END IF;

    INSERT INTO public.products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
    VALUES
        ('prod_001', user_uuid, 'Solar Panel 300W', 'High-efficiency monocrystalline solar panel', 'Solar Panels', 150.00, 250.00, 50, 'https://example.com/solar-panel-300w.jpg', NOW(), NOW()),
        ('prod_002', user_uuid, 'Inverter 5KW', 'Hybrid solar inverter with battery support', 'Inverters', 500.00, 850.00, 20, 'https://example.com/inverter-5kw.jpg', NOW(), NOW()),
        ('prod_003', user_uuid, 'Deep Cycle Battery 200Ah', 'Gel battery for solar energy storage', 'Batteries', 200.00, 350.00, 30, 'https://example.com/battery-200ah.jpg', NOW(), NOW()),
        ('prod_004', user_uuid, 'Mounting Kit', 'Universal mounting kit for rooftop solar panels', 'Accessories', 50.00, 90.00, 100, 'https://example.com/mounting-kit.jpg', NOW(), NOW()),
        ('prod_005', user_uuid, 'Charge Controller 60A', 'MPPT solar charge controller', 'Controllers', 80.00, 140.00, 40, 'https://example.com/charge-controller-60a.jpg', NOW(), NOW()),
        ('prod_006', user_uuid, 'Mounting Kit (Roof)', 'Aluminum mounting kit for roof installations', 'Mounting Systems', 80.00, 120.00, 150, 'https://example.com/mounting-kit-roof.jpg', NOW(), NOW()),
        ('prod_007', user_uuid, 'Solar Cable 6mm²', 'UV resistant solar cable', 1.50, 1000, 'Cables', 'https://example.com/solar-cable.jpg', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        cost_price = EXCLUDED.cost_price,
        selling_price = EXCLUDED.selling_price,
        quantity_in_stock = EXCLUDED.quantity_in_stock,
        image_url = EXCLUDED.image_url,
        updated_at = NOW();
END $$;

-- Insert Clients
INSERT INTO clients (id, user_id, name, email, phone, address, created_at, updated_at)
VALUES
('client_001', 'user_abc', 'Burkina Faso Energy Co.', 'bfenergy@example.com', '+226 70 00 11 22', 'Ouagadougou, Burkina Faso', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    updated_at = NOW();

INSERT INTO clients (id, user_id, name, email, phone, address, created_at, updated_at)
VALUES
('client_002', 'user_abc', 'Green Power Homes', 'greenpower@example.com', '+226 71 11 22 33', 'Bobo-Dioulasso, Burkina Faso', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    updated_at = NOW();

INSERT INTO clients (id, user_id, name, email, phone, address, created_at, updated_at)
VALUES
('client_003', 'user_abc', 'Rural Electrification Project', 'ruralep@example.com', '+226 72 22 33 44', 'Koudougou, Burkina Faso', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    updated_at = NOW();

-- Insert Suppliers
INSERT INTO suppliers (id, user_id, name, email, phone, address, created_at, updated_at)
VALUES
('supp_001', 'user_abc', 'Global Solar Tech', 'globalsolar@example.com', '+1 555 123 4567', 'Shenzhen, China', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    updated_at = NOW();

INSERT INTO suppliers (id, user_id, name, email, phone, address, created_at, updated_at)
VALUES
('supp_002', 'user_abc', 'African Renewable Solutions', 'africasol@example.com', '+27 11 987 6543', 'Johannesburg, South Africa', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    updated_at = NOW();

INSERT INTO suppliers (id, user_id, name, email, phone, address, created_at, updated_at)
VALUES
('supp_003', 'user_abc', 'Eco-Power Distributors', 'ecopower@example.com', '+33 1 23 45 67 89', 'Paris, France', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    updated_at = NOW();

-- Insert Sales
INSERT INTO sales (id, user_id, product_id, client_id, quantity, total_price, sale_date, created_at, updated_at)
VALUES
('sale_001', 'user_abc', 'prod_001', 'client_001', 10, 2500.00, '2024-07-15', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    product_id = EXCLUDED.product_id,
    client_id = EXCLUDED.client_id,
    quantity = EXCLUDED.quantity,
    total_price = EXCLUDED.total_price,
    sale_date = EXCLUDED.sale_date,
    updated_at = NOW();

INSERT INTO sales (id, user_id, product_id, client_id, quantity, total_price, sale_date, created_at, updated_at)
VALUES
('sale_002', 'user_abc', 'prod_002', 'client_002', 2, 1700.00, '2024-07-20', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    product_id = EXCLUDED.product_id,
    client_id = EXCLUDED.client_id,
    quantity = EXCLUDED.quantity,
    total_price = EXCLUDED.total_price,
    sale_date = EXCLUDED.sale_date,
    updated_at = NOW();

INSERT INTO sales (id, user_id, product_id, client_id, quantity, total_price, sale_date, created_at, updated_at)
VALUES
('sale_003', 'user_abc', 'prod_003', 'client_001', 5, 1750.00, '2024-07-22', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    product_id = EXCLUDED.product_id,
    client_id = EXCLUDED.client_id,
    quantity = EXCLUDED.quantity,
    total_price = EXCLUDED.total_price,
    sale_date = EXCLUDED.sale_date,
    updated_at = NOW();

-- Insert Purchases
INSERT INTO purchases (id, user_id, product_id, supplier_id, quantity, total_cost, purchase_date, created_at, updated_at)
VALUES
('pur_001', 'user_abc', 'prod_001', 'supp_001', 15, 2250.00, '2024-07-01', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    product_id = EXCLUDED.product_id,
    supplier_id = EXCLUDED.supplier_id,
    quantity = EXCLUDED.quantity,
    total_cost = EXCLUDED.total_cost,
    purchase_date = EXCLUDED.purchase_date,
    updated_at = NOW();

INSERT INTO purchases (id, user_id, product_id, supplier_id, quantity, total_cost, purchase_date, created_at, updated_at)
VALUES
('pur_002', 'user_abc', 'prod_002', 'supp_002', 5, 2500.00, '2024-07-05', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    product_id = EXCLUDED.product_id,
    supplier_id = EXCLUDED.supplier_id,
    quantity = EXCLUDED.quantity,
    total_cost = EXCLUDED.total_cost,
    purchase_date = EXCLUDED.purchase_date,
    updated_at = NOW();

INSERT INTO purchases (id, user_id, product_id, supplier_id, quantity, total_cost, purchase_date, created_at, updated_at)
VALUES
('pur_003', 'user_abc', 'prod_004', 'supp_001', 50, 2500.00, '2024-07-10', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    product_id = EXCLUDED.product_id,
    supplier_id = EXCLUDED.supplier_id,
    quantity = EXCLUDED.quantity,
    total_cost = EXCLUDED.total_cost,
    purchase_date = EXCLUDED.purchase_date,
    updated_at = NOW();

-- Insert Expenses
INSERT INTO expenses (id, user_id, amount, date, category, description, created_at, updated_at)
VALUES
('exp_001', 'user_abc', 120.00, '2024-07-03', 'Office Supplies', 'Monthly office supplies purchase', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    amount = EXCLUDED.amount,
    date = EXCLUDED.date,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO expenses (id, user_id, amount, date, category, description, created_at, updated_at)
VALUES
('exp_002', 'user_abc', 500.00, '2024-07-10', 'Utilities', 'Electricity bill for July', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    amount = EXCLUDED.amount,
    date = EXCLUDED.date,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO expenses (id, user_id, amount, date, category, description, created_at, updated_at)
VALUES
('exp_003', 'user_abc', 300.00, '2024-07-18', 'Transportation', 'Fuel for delivery vehicle', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    amount = EXCLUDED.amount,
    date = EXCLUDED.date,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Insert Banking Transactions
INSERT INTO banking_transactions (id, user_id, amount, type, description, created_at, updated_at)
VALUES
('bank_001', 'user_abc', 5000.00, 'income', 'Initial capital injection', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    amount = EXCLUDED.amount,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO banking_transactions (id, user_id, amount, type, description, created_at, updated_at)
VALUES
('bank_002', 'user_abc', 2500.00, 'income', 'Payment for Sale #001', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    amount = EXCLUDED.amount,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO banking_transactions (id, user_id, amount, type, description, created_at, updated_at)
VALUES
('bank_003', 'user_abc', 120.00, 'expense', 'Payment for Expense #001', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    amount = EXCLUDED.amount,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO banking_transactions (id, user_id, amount, type, description, created_at, updated_at)
VALUES
('bank_004', 'user_abc', 1700.00, 'income', 'Payment for Sale #002', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    amount = EXCLUDED.amount,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO banking_transactions (id, user_id, amount, type, description, created_at, updated_at)
VALUES
('bank_005', 'user_abc', 2250.00, 'expense', 'Payment for Purchase #001', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    amount = EXCLUDED.amount,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    updated_at = NOW();

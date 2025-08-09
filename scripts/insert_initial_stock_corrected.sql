-- Corrected script for inserting initial stock and related data.
-- This script assumes the schema is already created and correct.
-- Ensure 'user_abc' exists in the 'users' table or replace with an actual user ID.

-- Insert Products
INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_001', 'user_abc', 'Solar Panel 300W', 'High-efficiency monocrystalline solar panel', 'Solar Panels', 150.00, 250.00, 50, 'https://example.com/solar-panel-300w.jpg', NOW(), NOW())
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

INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_002', 'user_abc', 'Inverter 5KW', 'Hybrid solar inverter with battery support', 'Inverters', 500.00, 850.00, 20, 'https://example.com/inverter-5kw.jpg', NOW(), NOW())
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

INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_003', 'user_abc', 'Deep Cycle Battery 200Ah', 'Gel battery for solar energy storage', 'Batteries', 200.00, 350.00, 30, 'https://example.com/battery-200ah.jpg', NOW(), NOW())
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

INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_004', 'user_abc', 'Mounting Kit', 'Universal mounting kit for rooftop solar panels', 'Accessories', 50.00, 90.00, 100, 'https://example.com/mounting-kit.jpg', NOW(), NOW())
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

INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_005', 'user_abc', 'Charge Controller 60A', 'MPPT solar charge controller', 'Controllers', 80.00, 140.00, 40, 'https://example.com/charge-controller-60a.jpg', NOW(), NOW())
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

-- Insert updated Products
INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Solar Panel 300W', 'High-efficiency monocrystalline solar panel', 'Solar Panels', 150.00, 250.00, 100, 'https://example.com/solar-panel-300w.jpg', NOW(), NOW())
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

INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Inverter 5KW', 'Hybrid inverter with battery support', 'Inverters', 500.00, 1200.00, 50, 'https://example.com/inverter-5kw.jpg', NOW(), NOW())
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

INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Deep Cycle Battery 200Ah', 'Gel battery for solar energy storage', 'Batteries', 200.00, 300.00, 200, 'https://example.com/battery-200ah.jpg', NOW(), NOW())
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

INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Charge Controller MPPT 60A', 'Maximum Power Point Tracking charge controller', 'Charge Controllers', 80.00, 150.00, 120, 'https://example.com/charge-controller-60a.jpg', NOW(), NOW())
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

INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mounting Kit for 4 Panels', 'Aluminum mounting structure for rooftop installation', 'Mounting Systems', 50.00, 80.00, 75, 'https://example.com/mounting-kit.jpg', NOW(), NOW())
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

-- Insert new Products
INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_011', 'user_abc', 'Solar Panel 100W', 'Monocrystalline solar panel', 'Solar Panels', 120.00, 150.00, 50, 'https://example.com/solar-panel-100w.jpg', NOW(), NOW())
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

INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_012', 'user_abc', 'Inverter 500W', 'Pure sine wave inverter', 'Inverters', 80.00, 100.00, 30, 'https://example.com/inverter-500w.jpg', NOW(), NOW())
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

INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url, created_at, updated_at)
VALUES
('prod_013', 'user_abc', 'Battery 12V 100Ah', 'Deep cycle gel battery', 'Batteries', 150.00, 200.00, 40, 'https://example.com/battery-12v-100ah.jpg', NOW(), NOW())
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

-- Insert additional Products
INSERT INTO products (user_id, name, description, price, stock, category)
VALUES
    ('user_abc', 'Solar Panel 100W', 'Monocrystalline solar panel, 100W', 99.99, 50, 'Solar Panels')
ON CONFLICT (id) DO NOTHING; -- Assuming 'id' is unique and you don't want to update existing
INSERT INTO products (user_id, name, description, price, stock, category)
VALUES
    ('user_abc', 'Solar Panel 200W', 'Monocrystalline solar panel, 200W', 189.99, 30, 'Solar Panels')
ON CONFLICT (id) DO NOTHING;
INSERT INTO products (user_id, name, description, price, stock, category)
VALUES
    ('user_abc', 'Inverter 1000W', 'Pure sine wave inverter, 1000W', 150.00, 20, 'Inverters')
ON CONFLICT (id) DO NOTHING;
INSERT INTO products (user_id, name, description, price, stock, category)
VALUES
    ('user_abc', 'Battery 100Ah', 'Deep cycle gel battery, 12V 100Ah', 250.00, 40, 'Batteries')
ON CONFLICT (id) DO NOTHING;
INSERT INTO products (user_id, name, description, price, stock, category)
VALUES
    ('user_abc', 'Charge Controller 30A', 'MPPT solar charge controller, 30A', 75.00, 25, 'Charge Controllers')
ON CONFLICT (id) DO NOTHING;

-- Insert additional Products from updates
INSERT INTO products (id, user_id, name, description, category, cost_price, selling_price, quantity_in_stock, image_url)
VALUES
    (uuid_generate_v4(), 'user_abc', 'Solar Panel 300W', 'High-efficiency monocrystalline solar panel', 'Solar Panels', 150.00, 250.00, 100, 'https://example.com/solar-panel-300w.jpg'),
    (uuid_generate_v4(), 'user_abc', 'Inverter 5KW', 'Hybrid inverter with battery support', 'Inverters', 500.00, 1200.00, 50, 'https://example.com/inverter-5kw.jpg'),
    (uuid_generate_v4(), 'user_abc', 'Lithium Battery 10kWh', 'High capacity lithium-ion battery for energy storage', 'Batteries', NULL, 4500.00, 20, 'https://example.com/lithium-battery-10kwh.jpg'),
    (uuid_generate_v4(), 'user_abc', 'Mounting Kit', 'Roof mounting kit for solar panels', 'Accessories', NULL, 150.00, 200, 'https://example.com/mounting-kit.jpg'),
    (uuid_generate_v4(), 'user_abc', 'Charge Controller MPPT 60A', 'Maximum Power Point Tracking charge controller', 'Electronics', NULL, 180.00, 75, 'https://example.com/charge-controller-60a.jpg');

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

-- Insert additional Clients
INSERT INTO clients (user_id, name, email, phone, address)
VALUES
    ('user_abc', 'Client A', 'clienta@example.com', '123-456-7890', '123 Main St, City A')
ON CONFLICT (id) DO NOTHING;
INSERT INTO clients (user_id, name, email, phone, address)
VALUES
    ('user_abc', 'Client B', 'clientb@example.com', '098-765-4321', '456 Oak Ave, City B')
ON CONFLICT (id) DO NOTHING;

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

-- Insert additional Suppliers
INSERT INTO suppliers (user_id, name, email, phone, address)
VALUES
    ('user_abc', 'Supplier X', 'supplierx@example.com', '111-222-3333', '789 Pine Ln, City X')
ON CONFLICT (id) DO NOTHING;
INSERT INTO suppliers (user_id, name, email, phone, address)
VALUES
    ('user_abc', 'Supplier Y', 'suppliery@example.com', '444-555-6666', '321 Elm Rd, City Y')
ON CONFLICT (id) DO NOTHING;

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

-- Insert additional Sales
INSERT INTO sales (user_id, product_id, client_id, quantity, amount)
SELECT
    'user_abc',
    (SELECT id FROM products WHERE name = 'Solar Panel 100W' AND user_id = 'user_abc'),
    (SELECT id FROM clients WHERE name = 'Client A' AND user_id = 'user_abc'),
    2,
    199.98
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Solar Panel 100W' AND user_id = 'user_abc')
  AND EXISTS (SELECT 1 FROM clients WHERE name = 'Client A' AND user_id = 'user_abc')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sales (user_id, product_id, client_id, quantity, amount)
SELECT
    'user_abc',
    (SELECT id FROM products WHERE name = 'Inverter 1000W' AND user_id = 'user_abc'),
    (SELECT id FROM clients WHERE name = 'Client B' AND user_id = 'user_abc'),
    1,
    150.00
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Inverter 1000W' AND user_id = 'user_abc')
  AND EXISTS (SELECT 1 FROM clients WHERE name = 'Client B' AND user_id = 'user_abc')
ON CONFLICT (id) DO NOTHING;

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

-- Insert additional Purchases
INSERT INTO purchases (user_id, product_id, supplier_id, quantity, amount)
SELECT
    'user_abc',
    (SELECT id FROM products WHERE name = 'Solar Panel 200W' AND user_id = 'user_abc'),
    (SELECT id FROM suppliers WHERE name = 'Supplier X' AND user_id = 'user_abc'),
    5,
    949.95
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Solar Panel 200W' AND user_id = 'user_abc')
  AND EXISTS (SELECT 1 FROM suppliers WHERE name = 'Supplier X' AND user_id = 'user_abc')
ON CONFLICT (id) DO NOTHING;

INSERT INTO purchases (user_id, product_id, supplier_id, quantity, amount)
SELECT
    'user_abc',
    (SELECT id FROM products WHERE name = 'Battery 100Ah' AND user_id = 'user_abc'),
    (SELECT id FROM suppliers WHERE name = 'Supplier Y' AND user_id = 'user_abc'),
    10,
    2500.00
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Battery 100Ah' AND user_id = 'user_abc')
  AND EXISTS (SELECT 1 FROM suppliers WHERE name = 'Supplier Y' AND user_id = 'user_abc')
ON CONFLICT (id) DO NOTHING;

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

-- Insert additional Expenses
INSERT INTO expenses (user_id, amount, category, description)
VALUES
    ('user_abc', 50.00, 'Office Supplies', 'Purchase of printer paper and ink')
ON CONFLICT (id) DO NOTHING;
INSERT INTO expenses (user_id, amount, category, description)
VALUES
    ('user_abc', 120.00, 'Utilities', 'Electricity bill for the month')
ON CONFLICT (id) DO NOTHING;

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

-- Insert additional Banking Transactions
INSERT INTO banking_transactions (user_id, amount, type, description)
VALUES
    ('user_abc', 199.98, 'income', 'Payment for Solar Panel 100W sale')
ON CONFLICT (id) DO NOTHING;
INSERT INTO banking_transactions (user_id, amount, type, description)
VALUES
    ('user_abc', 949.95, 'expense', 'Payment for Solar Panel 200W purchase')
ON CONFLICT (id) DO NOTHING;

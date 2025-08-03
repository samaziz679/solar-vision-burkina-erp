-- This script inserts initial stock data into the 'products' table.
-- Ensure that the 'products' table and 'users' table exist and are accessible.
-- Replace 'YOUR_USER_ID' with the actual user ID you want to associate these products with.

INSERT INTO products (id, created_at, user_id, name, description, price, stock, category, image_url)
VALUES
    (uuid_generate_v4(), NOW(), 'YOUR_USER_ID', 'Solar Panel 300W', 'High-efficiency monocrystalline solar panel', 250.00, 100, 'Solar Panels', 'https://example.com/solar-panel-300w.jpg'),
    (uuid_generate_v4(), NOW(), 'YOUR_USER_ID', 'Inverter 5KW', 'Hybrid solar inverter with battery support', 1200.00, 50, 'Inverters', 'https://example.com/inverter-5kw.jpg'),
    (uuid_generate_v4(), NOW(), 'YOUR_USER_ID', 'Deep Cycle Battery 200Ah', 'Gel battery for solar energy storage', 300.00, 200, 'Batteries', 'https://example.com/battery-200ah.jpg'),
    (uuid_generate_v4(), NOW(), 'YOUR_USER_ID', 'Charge Controller MPPT 60A', 'MPPT solar charge controller', 80.00, 150, 'Charge Controllers', 'https://example.com/charge-controller-60a.jpg'),
    (uuid_generate_v4(), NOW(), 'YOUR_USER_ID', 'Mounting Kit for Pitched Roof', 'Aluminum mounting structure for solar panels', 150.00, 75, 'Mounting Systems', 'https://example.com/mounting-kit.jpg');

-- Note: If you run this script multiple times, it will insert duplicate data
-- unless you add checks for existing product names or IDs.

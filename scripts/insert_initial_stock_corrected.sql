-- This script inserts initial stock data into the 'products' table.
-- Ensure that the 'products' table and its RLS policies are already set up
-- by running the 'complete_supabase_schema.sql' script first.

-- You need to replace 'YOUR_USER_ID' with the actual user ID from your auth.users table
-- for whom you want to insert this data.

INSERT INTO public.products (id, name, description, category, price, stock_quantity, image_url, created_at, updated_at)
VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Solar Panel 300W', 'High-efficiency monocrystalline solar panel', 'Solar Panels', 250.00, 100, 'https://example.com/solar_panel_300w.jpg', NOW(), NOW()),
    ('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'Inverter 5kW', 'Hybrid solar inverter with battery support', 'Inverters', 1200.00, 50, 'https://example.com/inverter_5kw.jpg', NOW(), NOW()),
    ('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Solar Battery 100Ah', 'Deep cycle gel battery for solar systems', 'Batteries', 300.00, 200, 'https://example.com/solar_battery_100ah.jpg', NOW(), NOW()),
    ('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'Mounting Kit', 'Universal mounting kit for pitched roofs', 'Accessories', 80.00, 150, 'https://example.com/mounting_kit.jpg', NOW(), NOW()),
    ('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'Charge Controller 60A', 'MPPT solar charge controller', 'Controllers', 150.00, 75, 'https://example.com/charge_controller_60a.jpg', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    image_url = EXCLUDED.image_url,
    updated_at = NOW();

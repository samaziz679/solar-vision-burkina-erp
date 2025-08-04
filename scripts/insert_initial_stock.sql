-- This script is for inserting initial stock data into the products table.
-- This is typically used for seeding your database with some default data.

-- Ensure you have products table created and RLS policies configured.
-- Replace 'your_user_id_here' with an actual user ID from your auth.users table.

INSERT INTO public.products (user_id, name, description, price, stock, category, image_url)
VALUES
    ('your_user_id_here', 'Solar Panel 300W', 'High-efficiency monocrystalline solar panel', 250.00, 100, 'Solar Panels', 'https://example.com/solar-panel-300w.jpg'),
    ('your_user_id_here', 'Inverter 5KW', 'Hybrid inverter with battery support', 1200.00, 50, 'Inverters', 'https://example.com/inverter-5kw.jpg'),
    ('your_user_id_here', 'Deep Cycle Battery 200Ah', 'Gel battery for solar energy storage', 300.00, 200, 'Batteries', 'https://example.com/battery-200ah.jpg'),
    ('your_user_id_here', 'Mounting Kit (Roof)', 'Aluminum mounting kit for roof installations', 80.00, 150, 'Mounting Systems', 'https://example.com/mounting-kit-roof.jpg'),
    ('your_user_id_here', 'Solar Cable 6mm²', 'UV resistant solar cable', 1.50, 1000, 'Cables', 'https://example.com/solar-cable.jpg');

-- Example of how to get a user_id if you have users in auth.users:
-- SELECT id FROM auth.users LIMIT 1;
-- Use the returned ID to replace 'your_user_id_here' above.

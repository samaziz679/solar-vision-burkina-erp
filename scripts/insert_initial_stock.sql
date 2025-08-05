-- This script inserts initial stock data into the 'products' table.
-- This is for demonstration purposes and should be adjusted for production.

INSERT INTO public.products (user_id, name, description, category, price, stock, image_url)
VALUES
    ('YOUR_USER_ID_HERE', 'Solar Panel 300W', 'High-efficiency monocrystalline solar panel', 'Solar Panels', 250.00, 100, '/placeholder.png?height=400&width=600&query=solar%20panel'),
    ('YOUR_USER_ID_HERE', 'Inverter 5kW', 'Hybrid inverter with battery storage capability', 'Inverters', 1500.00, 50, '/placeholder.png?height=400&width=600&query=solar%20inverter'),
    ('YOUR_USER_ID_HERE', 'Mounting Kit (Roof)', 'Universal roof mounting system for solar panels', 'Mounting Systems', 120.00, 200, '/placeholder.png?height=400&width=600&query=solar%20mounting%20kit'),
    ('YOUR_USER_ID_HERE', 'Solar Battery 10kWh', 'Lithium-ion battery for energy storage', 'Batteries', 5000.00, 20, '/placeholder.png?height=400&width=600&query=solar%20battery'),
    ('YOUR_USER_ID_HERE', 'Charge Controller 60A', 'MPPT charge controller for solar systems', 'Controllers', 180.00, 75, '/placeholder.png?height=400&width=600&query=charge%20controller');

-- Replace 'YOUR_USER_ID_HERE' with the actual user ID from your 'public.users' table.
-- You can find your user ID in the Supabase Auth dashboard or by querying the 'auth.users' table.

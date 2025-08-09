-- This script inserts initial stock data into the 'products' table.
-- It assumes the 'products' table already exists and has columns:
-- id, name, description, price, stock, category, supplier_id, user_id

INSERT INTO public.products (id, name, description, price, stock, category, supplier_id, user_id)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Solar Panel 300W', 'High efficiency monocrystalline solar panel', 250.00, 100, 'Solar Panels', NULL, '00000000-0000-0000-0000-000000000000'),
    ('b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e', 'Inverter 5KW', 'Hybrid solar inverter with battery support', 1200.00, 50, 'Inverters', NULL, '00000000-0000-0000-0000-000000000000'),
    ('c7d8e9f0-1a2b-3c4d-5e6f-7a8b9c0d1e2f', 'Lithium Battery 10kWh', 'High capacity lithium-ion battery for energy storage', 4500.00, 20, 'Batteries', NULL, '00000000-0000-0000-0000-000000000000'),
    ('d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a', 'Mounting Kit', 'Roof mounting kit for solar panels', 150.00, 200, 'Accessories', NULL, '00000000-0000-0000-0000-000000000000'),
    ('e9f0a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b', 'Charge Controller 60A', 'MPPT charge controller for solar systems', 180.00, 75, 'Electronics', NULL, '00000000-0000-0000-0000-000000000000');

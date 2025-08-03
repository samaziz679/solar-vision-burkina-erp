-- This script inserts initial stock data into the 'products' table.
-- Ensure that the 'products' table and its RLS policies are already set up
-- by running the 'complete_supabase_schema.sql' script first.

-- You need to replace 'YOUR_USER_ID' with the actual user ID from your auth.users table
-- for whom you want to insert this data.

INSERT INTO products (user_id, name, description, price, stock, category, image_url)
VALUES
    ('YOUR_USER_ID', 'Panneau Solaire 300W', 'Panneau solaire monocristallin haute efficacité', 150000.00, 50, 'Panneaux Solaires', '/placeholder.svg?height=48&width=48'),
    ('YOUR_USER_ID', 'Batterie Gel 200Ah', 'Batterie de stockage à décharge profonde pour systèmes solaires', 120000.00, 30, 'Batteries', '/placeholder.svg?height=48&width=48'),
    ('YOUR_USER_ID', 'Onduleur Hybride 3KW', 'Onduleur avec contrôleur de charge MPPT intégré', 250000.00, 15, 'Onduleurs', '/placeholder.svg?height=48&width=48'),
    ('YOUR_USER_ID', 'Régulateur MPPT 60A', 'Régulateur de charge solaire MPPT 12V/24V/48V', 45000.00, 40, 'Régulateurs', '/placeholder.svg?height=48&width=48'),
    ('YOUR_USER_ID', 'Câble Solaire 6mm²', 'Câble DC pour connexion de panneaux solaires', 1500.00, 500, 'Accessoires', '/placeholder.svg?height=48&width=48');

-- SQL script to empty the products table and load new opening stock from CSV
-- Generated on 2025-08-02T19:40:14.000Z

-- IMPORTANT: This will DELETE ALL existing data in the 'products' table.
-- If 'products' has foreign key relationships (e.g., with 'sales' or 'purchases'),
-- TRUNCATE with CASCADE will also delete related records in those tables.
-- Please ensure you understand the implications or back up your data if necessary.
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- Insert new initial stock data from the provided CSV file
INSERT INTO products (name, type, quantity, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros, prix_achat, unit, description) VALUES
('Raggie 20AH Controller', 'Controller de charge', 80, 8500.00, 9000.00, 7500.00, 6805.00, 'unité', NULL),
('Panneau Solaire 300W', 'Panneau Solaire', 50, 200000.00, 190000.00, 180000.00, 150000.00, 'unité', 'Panneau solaire monocristallin haute efficacité'),
('Batterie Lithium 100Ah', 'Batterie', 30, 350000.00, 330000.00, 300000.00, 250000.00, 'unité', 'Batterie au lithium-ion pour stockage d''énergie'),
('Onduleur Hybride 5kW', 'Onduleur', 20, 550000.00, 520000.00, 480000.00, 400000.00, 'unité', 'Onduleur solaire hybride avec contrôleur de charge MPPT'),
('Câble Solaire 6mm²', 'Accessoire', 500, 2500.00, 2300.00, 2000.00, 1500.00, 'mètre', 'Câble DC pour systèmes solaires'),
('Connecteur MC4', 'Accessoire', 200, 1800.00, 1700.00, 1500.00, 1000.00, 'paire', 'Connecteur rapide pour panneaux solaires'),
('Batterie Gel 200AH', 'Batterie', 19, 120000.00, 115000.00, 110000.00, 95000.00, 'unité', 'Batterie au gel pour stockage d''énergie'),
('Chargeur Solaire USB', 'Accessoire', 120, 5000.00, 4500.00, 4000.00, 3000.00, 'unité', 'Chargeur solaire portable avec ports USB'),
('Lampe Solaire 10W', 'Eclairage', 150, 12000.00, 11000.00, 10000.00, 8000.00, 'unité', 'Lampe solaire LED pour éclairage extérieur');

-- Optional: Add ON CONFLICT (name) DO NOTHING; if you want to prevent duplicates on re-run
-- Example: INSERT INTO products (...) VALUES (...) ON CONFLICT (name) DO NOTHING;

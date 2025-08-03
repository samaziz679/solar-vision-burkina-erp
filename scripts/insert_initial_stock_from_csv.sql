-- SQL INSERT statements for initial product stock
-- Generated on 2025-08-02T19:19:57.000Z

INSERT INTO products (name, description, quantity, unit, prix_achat, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros, type) VALUES
('Panneau Solaire 300W', NULL, 50, 'unité', 150000.00, 200000.00, 190000.00, 180000.00, 'Panneau Solaire'),
('Batterie Lithium 100Ah', NULL, 30, 'unité', 250000.00, 350000.00, 330000.00, 300000.00, 'Batterie'),
('Onduleur Hybride 5kW', NULL, 20, 'unité', 400000.00, 550000.00, 520000.00, 480000.00, 'Onduleur'),
('Câble Solaire 6mm²', NULL, 500, 'unité', 1500.00, 2500.00, 2300.00, 2000.00, 'Accessoire'),
('Connecteur MC4', NULL, 200, 'unité', 1000.00, 1800.00, 1700.00, 1500.00, 'Accessoire');

-- Optional: Add ON CONFLICT (name) DO NOTHING; if you want to prevent duplicates on re-run
-- Example: INSERT INTO products (...) VALUES (...) ON CONFLICT (name) DO NOTHING;

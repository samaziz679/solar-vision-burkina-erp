-- Corrected script for inserting initial stock into the products table.
-- Replace 'YOUR_USER_ID' with the actual user_id from your auth.users table.
-- Ensure the UUID is valid.

INSERT INTO products (user_id, name, quantity, unit, type, prix_achat, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros, description, image)
VALUES
('YOUR_USER_ID', 'Panneau Solaire 300W', 50, 'unité', 'Panneau Solaire', 150000.00, 200000.00, 190000.00, 180000.00, 'Panneau solaire monocristallin de haute efficacité.', 'https://example.com/panel300w.jpg'),
('YOUR_USER_ID', 'Batterie Gel 200Ah', 30, 'unité', 'Batterie', 100000.00, 130000.00, 125000.00, 120000.00, 'Batterie au gel à décharge profonde pour systèmes solaires.', 'https://example.com/battery200ah.jpg'),
('YOUR_USER_ID', 'Onduleur Hybride 3KW', 15, 'unité', 'Onduleur', 250000.00, 320000.00, 300000.00, 280000.00, 'Onduleur hybride avec contrôleur de charge intégré.', 'https://example.com/inverter3kw.jpg'),
('YOUR_USER_ID', 'Câble Solaire 6mm²', 200, 'mètre', 'Accessoire', 1000.00, 1500.00, NULL, NULL, 'Câble solaire résistant aux UV pour installations extérieures.', 'https://example.com/cable6mm.jpg'),
('YOUR_USER_ID', 'Connecteur MC4', 100, 'paire', 'Accessoire', 500.00, 800.00, NULL, NULL, 'Connecteurs MC4 pour panneaux solaires.', 'https://example.com/mc4.jpg');

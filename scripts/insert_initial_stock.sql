-- Insert initial stock data into the products table
INSERT INTO products (name, description, quantity, unit, prix_achat, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros, type) VALUES
('Panneau Solaire 300W', 'Panneau solaire monocristallin haute efficacité', 50, 'unité', 150000.00, 200000.00, 190000.00, 180000.00, 'Panneau Solaire'),
('Batterie Lithium 100Ah', 'Batterie au lithium-ion pour stockage d''énergie', 30, 'unité', 250000.00, 350000.00, 330000.00, 300000.00, 'Batterie'),
('Onduleur Hybride 5kW', 'Onduleur solaire hybride avec contrôleur de charge MPPT', 20, 'unité', 400000.00, 550000.00, 520000.00, 480000.00, 'Onduleur'),
('Câble Solaire 6mm²', 'Câble DC pour systèmes solaires', 500, 'mètre', 1500.00, 2500.00, 2300.00, 2000.00, 'Accessoire'),
('Connecteur MC4', 'Connecteur rapide pour panneaux solaires', 200, 'paire', 1000.00, 1800.00, 1700.00, 1500.00, 'Accessoire');

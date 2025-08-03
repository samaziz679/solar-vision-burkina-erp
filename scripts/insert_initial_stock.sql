-- This script is for inserting initial stock data into the 'products' table.
-- It's intended to be run once to populate the database with starting inventory.

INSERT INTO public.products (name, description, quantity, unit, prix_achat, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros, type, image)
VALUES
('Panneau Solaire 300W', 'Panneau solaire monocristallin haute efficacité', 50, 'unité', 150000.00, 180000.00, 175000.00, 160000.00, 'Panneau Solaire', 'https://example.com/panel300w.jpg'),
('Batterie Gel 200Ah', 'Batterie de stockage à décharge profonde', 30, 'unité', 120000.00, 145000.00, 140000.00, 128000.00, 'Batterie', 'https://example.com/battery200ah.jpg'),
('Onduleur Hybride 3KW', 'Onduleur avec contrôleur de charge intégré', 20, 'unité', 250000.00, 300000.00, 290000.00, 265000.00, 'Onduleur', 'https://example.com/inverter3kw.jpg'),
('Câble Solaire 6mm²', 'Câble DC pour connexion de panneaux solaires', 500, 'mètre', 1500.00, 2000.00, 1900.00, 1650.00, 'Accessoire', 'https://example.com/cable6mm.jpg'),
('Connecteur MC4', 'Connecteur rapide pour panneaux solaires', 100, 'paire', 2500.00, 3500.00, 3200.00, 2800.00, 'Accessoire', 'https://example.com/mc4.jpg'),
('Régulateur de Charge MPPT 60A', 'Contrôleur de charge MPPT pour systèmes solaires', 15, 'unité', 75000.00, 90000.00, 85000.00, 78000.00, 'Accessoire', 'https://example.com/mppt60a.jpg'),
('Panneau Solaire 100W', 'Petit panneau solaire pour applications diverses', 40, 'unité', 50000.00, 65000.00, 60000.00, 55000.00, 'Panneau Solaire', 'https://example.com/panel100w.jpg'),
('Batterie Lithium 100Ah', 'Batterie LiFePO4 légère et durable', 25, 'unité', 200000.00, 240000.00, 230000.00, 210000.00, 'Batterie', 'https://example.com/lithium100ah.jpg'),
('Onduleur Pur Sinus 1KW', 'Onduleur pour appareils sensibles', 10, 'unité', 100000.00, 120000.00, 115000.00, 105000.00, 'Onduleur', 'https://example.com/inverter1kw.jpg'),
('Kit de Fixation Toit', 'Kit complet pour montage de panneaux sur toiture', 10, 'kit', 40000.00, 55000.00, 50000.00, 45000.00, 'Accessoire', 'https://example.com/roofkit.jpg');

-- You can add more INSERT statements here for additional products.

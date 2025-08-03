-- SQL script to insert initial stock data into the products table

INSERT INTO products (name, type, quantity, prix_achat, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros, seuil_stock_bas) VALUES
('Raggie 20AH Controller', 'Controller de charge', 80, 0, 8500, 9000, 7500, 10),
('Panneau Solaire 150W', 'Panneau Solaire', 50, 0, 75000, 72000, 68000, 10),
('Batterie Gel 200AH', 'Batterie', 30, 0, 120000, 115000, 110000, 10),
('Onduleur Hybride 3KW', 'Onduleur', 15, 0, 250000, 240000, 230000, 10),
('Cable Solaire 6mm', 'Cable', 200, 0, 2500, 2200, 2000, 10),
('Support Panneau', 'Support', 100, 0, 15000, 14000, 13000, 10);

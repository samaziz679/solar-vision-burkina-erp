-- SQL script to insert initial stock data into the products table
-- This script first truncates the products table to ensure a clean insert.

TRUNCATE TABLE products RESTART IDENTITY CASCADE;

INSERT INTO products (name, type, quantity, prix_achat, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros, seuil_stock_bas) VALUES
('Raggie 20AH Controller', 'Controller de charge', 80, 0, 8500, 9000, 7500, 10),
('Panneau Solaire 150W', 'Panneau Solaire', 50, 0, 75000, 72000, 68000, 10),
('Batterie Gel 200AH', 'Batterie', 30, 0, 120000, 115000, 110000, 10),
('Onduleur Hybride 3KW', 'Onduleur', 15, 0, 250000, 240000, 230000, 10),
('Cable Solaire 6mm', 'Cable', 200, 0, 2500, 2200, 2000, 10),
('Support Panneau', 'Support', 100, 0, 15000, 14000, 13000, 10),
('Pompe Solaire 1HP', 'Pompe', 5, 0, 180000, 170000, 160000, 2),
('Lampe Solaire 10W', 'Eclairage', 150, 0, 12000, 11000, 10000, 20),
('Chargeur Solaire USB', 'Accessoire', 120, 0, 5000, 4500, 4000, 15),
('Ventilateur Solaire', 'Ventilateur', 40, 0, 35000, 32000, 30000, 5);

-- SQL script to empty the products table and load new opening stock from pasted data
-- Generated on 2025-08-02T19:43:13.000Z

-- IMPORTANT: This will DELETE ALL existing data in the 'products' table.
-- If 'products' has foreign key relationships (e.g., with 'sales' or 'purchases'),
-- TRUNCATE with CASCADE will also delete related records in those tables.
-- Please ensure you understand the implications or back up your data if necessary.
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- Insert new initial stock data from the provided list
INSERT INTO products (name, type, quantity, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros, prix_achat, unit, description) VALUES
('888AH BELTA', 'Batterie', 100, 9000.00, 9300.00, 8000.00, 7075.00, 'unité', NULL),
('15000AH BELTA', 'Batterie', 100, 10000.00, 10500.00, 9000.00, 8307.00, 'unité', NULL),
('20000AH BELTA', 'Batterie', 100, 11000.00, 11500.00, 9000.00, 9099.00, 'unité', NULL),
('2000AH USB', 'Batterie', 10, 125000.00, 135000.00, 120000.00, 93550.00, 'unité', NULL),
('MANA Original', 'Batterie', 200, 14000.00, 14500.00, 12000.00, 11046.00, 'unité', NULL),
('55W Solar Panel', 'Panneaux solaire', 150, 11000.00, 11500.00, 10000.00, 8766.00, 'unité', NULL),
('35W Solar Panel', 'Panneaux solaire', 150, 11500.00, 12000.00, 8000.00, 11345.00, 'unité', NULL),
('V-DC510 Fan', 'Ventilateur DC', 90, 17000.00, 17500.00, 12500.00, 13185.00, 'unité', NULL),
('V-DC001 Fan', 'Ventilateur DC', 170, 10000.00, 10500.00, 9500.00, 7840.00, 'unité', NULL),
('USSF-010R Fan', 'Ventilateur DC', 100, 16500.00, 17000.00, 15000.00, 11345.00, 'unité', NULL),
('V-AD455 Fan', 'Ventilateur DC', 50, 24000.00, 25000.00, 23000.00, 18443.00, 'unité', NULL),
('V-DC477 Fan', 'Ventilateur DC', 100, 28500.00, 30000.00, 25000.00, 22020.00, 'unité', NULL),
('40000mAh Power Bank', 'Power bank', 90, 10500.00, 11000.00, 9000.00, 6788.00, 'unité', NULL),
('2000W Inverter', 'Inverter', 16, 53000.00, 55000.00, 45000.00, 40184.00, 'unité', NULL),
('200W Inverter', 'Inverter', 200, 6500.00, 7000.00, 6000.00, 7354.00, 'unité', NULL),
('Raggie 20AH Controller', 'Controller de charge', 80, 8500.00, 9000.00, 7500.00, 6805.00, 'unité', NULL);

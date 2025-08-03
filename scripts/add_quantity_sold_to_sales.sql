-- Add the missing quantity_sold column to the sales table
ALTER TABLE sales
ADD COLUMN quantity_sold INT NOT NULL DEFAULT 0;

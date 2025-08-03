-- Add the missing total_price column to the sales table
ALTER TABLE sales
ADD COLUMN total_price DECIMAL(10, 2) NOT NULL DEFAULT 0;

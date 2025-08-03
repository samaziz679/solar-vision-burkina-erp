-- Add the missing unit column to the products table
ALTER TABLE products
ADD COLUMN unit TEXT;

-- Add the missing description column to the products table
ALTER TABLE products
ADD COLUMN description TEXT;

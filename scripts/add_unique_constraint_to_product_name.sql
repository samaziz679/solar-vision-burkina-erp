-- Add a unique constraint to the 'name' column in the 'products' table
ALTER TABLE products
ADD CONSTRAINT products_name_unique UNIQUE (name);

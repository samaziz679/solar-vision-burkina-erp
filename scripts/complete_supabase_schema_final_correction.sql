-- This script is intended to be run after the initial schema creation and previous corrections.
-- It ensures that the 'updated_at' columns have a default value and are updated on change,
-- and also sets the 'sale_date' and 'purchase_date' to NOT NULL if they were not already.

-- Ensure 'updated_at' columns are NOT NULL and have a default of CURRENT_TIMESTAMP
-- and apply the trigger for automatic updates on modification.

-- For 'users' table
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
-- Recreate trigger if it was dropped or not created correctly
DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- For 'products' table
ALTER TABLE "products" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- For 'clients' table
ALTER TABLE "clients" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
DROP TRIGGER IF EXISTS set_clients_updated_at ON clients;
CREATE TRIGGER set_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- For 'suppliers' table
ALTER TABLE "suppliers" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "suppliers" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
DROP TRIGGER IF EXISTS set_suppliers_updated_at ON suppliers;
CREATE TRIGGER set_suppliers_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- For 'sales' table
ALTER TABLE "sales" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "sales" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "sales" ALTER COLUMN "sale_date" SET NOT NULL; -- Ensure sale_date is NOT NULL
DROP TRIGGER IF EXISTS set_sales_updated_at ON sales;
CREATE TRIGGER set_sales_updated_at
BEFORE UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- For 'purchases' table
ALTER TABLE "purchases" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "purchases" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "purchases" ALTER COLUMN "purchase_date" SET NOT NULL; -- Ensure purchase_date is NOT NULL
DROP TRIGGER IF EXISTS set_purchases_updated_at ON purchases;
CREATE TRIGGER set_purchases_updated_at
BEFORE UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- For 'expenses' table
ALTER TABLE "expenses" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "expenses" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "expenses" ALTER COLUMN "date" SET NOT NULL; -- Ensure date is NOT NULL
DROP TRIGGER IF EXISTS set_expenses_updated_at ON expenses;
CREATE TRIGGER set_expenses_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- For 'banking_transactions' table
ALTER TABLE "banking_transactions" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "banking_transactions" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
DROP TRIGGER IF EXISTS set_banking_transactions_updated_at ON banking_transactions;
CREATE TRIGGER set_banking_transactions_updated_at
BEFORE UPDATE ON banking_transactions
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Ensure the update_timestamp function exists and is correct
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

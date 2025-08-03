-- This script is intended to be run after the initial schema creation if there were any issues.
-- It ensures that the 'updated_at' columns have a default value and are updated on change.

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL; -- Allow NULL temporarily if needed for existing rows without default

-- Add trigger for updated_at on users table
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "products" ALTER COLUMN "updated_at" DROP NOT NULL;

-- Add trigger for updated_at on products table
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "clients" ALTER COLUMN "updated_at" DROP NOT NULL;

-- Add trigger for updated_at on clients table
CREATE TRIGGER set_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- AlterTable
ALTER TABLE "suppliers" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "suppliers" ALTER COLUMN "updated_at" DROP NOT NULL;

-- Add trigger for updated_at on suppliers table
CREATE TRIGGER set_suppliers_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- AlterTable
ALTER TABLE "sales" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "sales" ALTER COLUMN "updated_at" DROP NOT NULL;

-- Add trigger for updated_at on sales table
CREATE TRIGGER set_sales_updated_at
BEFORE UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- AlterTable
ALTER TABLE "purchases" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "purchases" ALTER COLUMN "updated_at" DROP NOT NULL;

-- Add trigger for updated_at on purchases table
CREATE TRIGGER set_purchases_updated_at
BEFORE UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- AlterTable
ALTER TABLE "expenses" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "expenses" ALTER COLUMN "updated_at" DROP NOT NULL;

-- Add trigger for updated_at on expenses table
CREATE TRIGGER set_expenses_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- AlterTable
ALTER TABLE "banking_transactions" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "banking_transactions" ALTER COLUMN "updated_at" DROP NOT NULL;

-- Add trigger for updated_at on banking_transactions table
CREATE TRIGGER set_banking_transactions_updated_at
BEFORE UPDATE ON banking_transactions
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Re-add NOT NULL constraint if it was temporarily removed and all existing rows have values
-- ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;
-- ALTER TABLE "products" ALTER COLUMN "updated_at" SET NOT NULL;
-- ALTER TABLE "clients" ALTER COLUMN "updated_at" SET NOT NULL;
-- ALTER TABLE "suppliers" ALTER COLUMN "updated_at" SET NOT NULL;
-- ALTER TABLE "sales" ALTER COLUMN "updated_at" SET NOT NULL;
-- ALTER TABLE "purchases" ALTER COLUMN "updated_at" SET NOT NULL;
-- ALTER TABLE "expenses" ALTER COLUMN "updated_at" SET NOT NULL;
-- ALTER TABLE "banking_transactions" ALTER COLUMN "updated_at" SET NOT NULL;

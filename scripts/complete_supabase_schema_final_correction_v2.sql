-- This script is intended to be run after the initial `supabase_schema.sql`
-- It includes additional schema definitions or corrections if needed.

-- Ensure uuid-ossp extension is enabled for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add any other necessary schema adjustments here.
-- For instance, if you need to add specific views or functions.

-- Example: A view to get total sales per product
CREATE OR REPLACE VIEW total_sales_per_product AS
SELECT
    p.name AS product_name,
    SUM(s.quantity_sold) AS total_quantity_sold,
    SUM(s.total_price) AS total_revenue
FROM
    products p
JOIN
    sales s ON p.id = s.product_id
GROUP BY
    p.name
ORDER BY
    total_revenue DESC;

-- Example: A view to get current stock levels
CREATE OR REPLACE VIEW current_stock AS
SELECT
    id,
    name,
    quantity,
    unit,
    prix_achat,
    prix_vente_detail_1,
    prix_vente_detail_2,
    prix_vente_gros,
    type
FROM
    products
WHERE
    quantity > 0;

-- Example: A view for financial summary (deposits vs withdrawals)
CREATE OR REPLACE VIEW financial_summary AS
SELECT
    date,
    SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END) AS total_deposits,
    SUM(CASE WHEN type = 'withdrawal' THEN amount ELSE 0 END) AS total_withdrawals,
    SUM(CASE WHEN type = 'deposit' THEN amount ELSE -amount END) AS net_flow
FROM
    bank_entries
GROUP BY
    date
ORDER BY
    date ASC;

-- Add a trigger to update product quantity on new sales
CREATE OR REPLACE FUNCTION update_product_quantity_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET quantity = quantity - NEW.quantity_sold
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists to recreate it
DROP TRIGGER IF EXISTS trg_update_product_quantity_on_sale ON sales;
CREATE TRIGGER trg_update_product_quantity_on_sale
AFTER INSERT ON sales
FOR EACH ROW
EXECUTE FUNCTION update_product_quantity_on_sale();

-- Add a trigger to update product quantity on new purchases
CREATE OR REPLACE FUNCTION update_product_quantity_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET quantity = quantity + NEW.quantity_purchased
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists to recreate it
DROP TRIGGER IF EXISTS trg_update_product_quantity_on_purchase ON purchases;
CREATE TRIGGER trg_update_product_quantity_on_purchase
AFTER INSERT ON purchases
FOR EACH ROW
EXECUTE FUNCTION update_product_quantity_on_purchase();

-- Add a trigger to update product quantity on sale deletion (revert quantity)
CREATE OR REPLACE FUNCTION revert_product_quantity_on_sale_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET quantity = quantity + OLD.quantity_sold
    WHERE id = OLD.product_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists to recreate it
DROP TRIGGER IF EXISTS trg_revert_product_quantity_on_sale_delete ON sales;
CREATE TRIGGER trg_revert_product_quantity_on_sale_delete
AFTER DELETE ON sales
FOR EACH ROW
EXECUTE FUNCTION revert_product_quantity_on_sale_delete();

-- Add a trigger to update product quantity on purchase deletion (revert quantity)
CREATE OR REPLACE FUNCTION revert_product_quantity_on_purchase_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET quantity = quantity - OLD.quantity_purchased
    WHERE id = OLD.product_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists to recreate it
DROP TRIGGER IF EXISTS trg_revert_product_quantity_on_purchase_delete ON purchases;
CREATE TRIGGER trg_revert_product_quantity_on_purchase_delete
AFTER DELETE ON purchases
FOR EACH ROW
EXECUTE FUNCTION revert_product_quantity_on_purchase_delete();

-- Add a trigger to update product quantity on sale update (adjust quantity)
CREATE OR REPLACE FUNCTION adjust_product_quantity_on_sale_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Only adjust if product_id is the same, otherwise it's a transfer
    IF OLD.product_id = NEW.product_id THEN
        UPDATE products
        SET quantity = quantity + OLD.quantity_sold - NEW.quantity_sold
        WHERE id = NEW.product_id;
    ELSE
        -- If product_id changes, revert old product and deduct from new product
        UPDATE products
        SET quantity = quantity + OLD.quantity_sold
        WHERE id = OLD.product_id;
        UPDATE products
        SET quantity = quantity - NEW.quantity_sold
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists to recreate it
DROP TRIGGER IF EXISTS trg_adjust_product_quantity_on_sale_update ON sales;
CREATE TRIGGER trg_adjust_product_quantity_on_sale_update
AFTER UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION adjust_product_quantity_on_sale_update();

-- Add a trigger to update product quantity on purchase update (adjust quantity)
CREATE OR REPLACE FUNCTION adjust_product_quantity_on_purchase_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Only adjust if product_id is the same, otherwise it's a transfer
    IF OLD.product_id = NEW.product_id THEN
        UPDATE products
        SET quantity = quantity - OLD.quantity_purchased + NEW.quantity_purchased
        WHERE id = NEW.product_id;
    ELSE
        -- If product_id changes, revert old product and add to new product
        UPDATE products
        SET quantity = quantity - OLD.quantity_purchased
        WHERE id = OLD.product_id;
        UPDATE products
        SET quantity = quantity + NEW.quantity_purchased
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists to recreate it
DROP TRIGGER IF EXISTS trg_adjust_product_quantity_on_purchase_update ON purchases;
CREATE TRIGGER trg_adjust_product_quantity_on_purchase_update
AFTER UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION adjust_product_quantity_on_purchase_update();

-- Add the missing date column to the bank_entries table
ALTER TABLE bank_entries
ADD COLUMN date DATE NOT NULL DEFAULT CURRENT_DATE;

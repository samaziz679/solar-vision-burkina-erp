-- Add the missing type column to the bank_entries table
ALTER TABLE bank_entries
ADD COLUMN type TEXT NOT NULL DEFAULT 'deposit';

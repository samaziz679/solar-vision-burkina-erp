-- This script contains the initial schema for the Solar Vision Burkina ERP database.
-- It's a basic setup and can be extended with more tables and columns as needed.

-- Enable the "uuid-ossp" extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Products (Inventory)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    quantity integer NOT NULL DEFAULT 0,
    unit text,
    prix_achat numeric(10, 2) NOT NULL,
    prix_vente_detail_1 numeric(10, 2) NOT NULL,
    prix_vente_detail_2 numeric(10, 2) NOT NULL,
    prix_vente_gros numeric(10, 2) NOT NULL,
    type text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Table for Clients
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    contact_person text,
    email text,
    phone text,
    address text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Table for Suppliers
CREATE TABLE IF NOT EXISTS public.suppliers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    contact_person text,
    email text,
    phone text,
    address text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Table for Sales
CREATE TABLE IF NOT EXISTS public.sales (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
    sale_date date NOT NULL DEFAULT now(),
    total_amount numeric(1

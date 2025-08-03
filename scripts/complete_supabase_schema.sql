-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  -- New column for user role
  role text default 'user'::text not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for select using (true);

create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL UNIQUE,
  quantity INT NOT NULL,
  unit TEXT,
  type TEXT,
  prix_achat NUMERIC(10, 2) NOT NULL,
  prix_vente_detail_1 NUMERIC(10, 2) NOT NULL,
  prix_vente_detail_2 NUMERIC(10, 2),
  prix_vente_gros NUMERIC(10, 2),
  description TEXT,
  image TEXT
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own products." ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create products." ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products." ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products." ON products FOR DELETE USING (auth.uid() = user_id);

-- Create clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT,
  address TEXT
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own clients." ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create clients." ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clients." ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clients." ON clients FOR DELETE USING (auth.uid() = user_id);

-- Create suppliers table
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT,
  address TEXT
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own suppliers." ON suppliers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create suppliers." ON suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own suppliers." ON suppliers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own suppliers." ON suppliers FOR DELETE USING (auth.uid() = user_id);

-- Create sales table
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity_sold INT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  sale_date DATE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sales." ON sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create sales." ON sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sales." ON sales FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sales." ON sales FOR DELETE USING (auth.uid() = user_id);

-- Create purchases table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  purchase_date DATE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases." ON purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create purchases." ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own purchases." ON purchases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own purchases." ON purchases FOR DELETE USING (auth.uid() = user_id);

-- Create expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expense_date DATE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  notes TEXT
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own expenses." ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create expenses." ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses." ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses." ON expenses FOR DELETE USING (auth.uid() = user_id);

-- Create bank_entries table
CREATE TABLE bank_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL,
  type TEXT NOT NULL, -- 'Dépôt' or 'Retrait'
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL
);

ALTER TABLE bank_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bank entries." ON bank_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bank entries." ON bank_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bank entries." ON bank_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bank entries." ON bank_entries FOR DELETE USING (auth.uid() = user_id);

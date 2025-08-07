import { unstable_noStore as noStore } from 'next/cache';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { BankingAccount } from '../supabase/types';

export async function fetchBankingAccounts(): Promise<BankingAccount[]> {
  noStore();
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
        remove: (name: string, options: any) => cookieStore.delete(name, options),
      },
    }
  );

  const { data, error } = await supabase
    .from('banking_accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch banking accounts.');
  }

  return data;
}

export async function fetchBankingAccountById(id: string): Promise<BankingAccount | null> {
  noStore();
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
        remove: (name: string, options: any) => cookieStore.delete(name, options),
      },
    }
  );

  const { data, error } = await supabase
    .from('banking_accounts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch banking account.');
  }

  return data;
}

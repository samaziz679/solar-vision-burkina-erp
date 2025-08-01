export type Database = {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: "admin" | "stock_manager" | "commercial" | "finance" | "visitor" | "seller"
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          role: "admin" | "stock_manager" | "commercial" | "finance" | "visitor" | "seller"
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          role?: "admin" | "stock_manager" | "commercial" | "finance" | "visitor" | "seller"
          created_at?: string
          created_by?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          type: string | null
          quantity: number
          prix_achat: number
          prix_vente_detail_1: number
          prix_vente_detail_2: number
          prix_vente_gros: number
          seuil_stock_bas: number
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          type?: string | null
          quantity?: number
          prix_achat?: number
          prix_vente_detail_1?: number
          prix_vente_detail_2?: number
          prix_vente_gros?: number
          seuil_stock_bas?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string | null
          quantity?: number
          prix_achat?: number
          prix_vente_detail_1?: number
          prix_vente_detail_2?: number
          prix_vente_gros?: number
          seuil_stock_bas?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      sales: {
        Row: {
          id: string
          product_id: string
          client_id: string | null
          quantity: number
          price_plan: "detail_1" | "detail_2" | "gros"
          unit_price: number
          total: number
          sale_date: string
          created_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          product_id: string
          client_id?: string | null
          quantity: number
          price_plan: "detail_1" | "detail_2" | "gros"
          unit_price: number
          total: number
          sale_date?: string
          created_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          client_id?: string | null
          quantity?: number
          price_plan?: "detail_1" | "detail_2" | "gros"
          unit_price?: number
          total?: number
          sale_date?: string
          created_by?: string | null
          notes?: string | null
        }
      }
      purchases: {
        Row: {
          id: string
          product_id: string
          supplier_id: string | null
          quantity: number
          unit_price: number
          total: number
          purchase_date: string
          created_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          product_id: string
          supplier_id?: string | null
          quantity: number
          unit_price: number
          total: number
          purchase_date?: string
          created_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          supplier_id?: string | null
          quantity?: number
          unit_price?: number
          total?: number
          purchase_date?: string
          created_by?: string | null
          notes?: string | null
        }
      }
      expenses: {
        Row: {
          id: string
          description: string
          category:
            | "salaire"
            | "loyer"
            | "emprunt"
            | "electricite"
            | "eau"
            | "internet"
            | "carburant"
            | "maintenance"
            | "autre"
          amount: number
          expense_date: string
          created_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          description: string
          category:
            | "salaire"
            | "loyer"
            | "emprunt"
            | "electricite"
            | "eau"
            | "internet"
            | "carburant"
            | "maintenance"
            | "autre"
          amount: number
          expense_date?: string
          created_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          description?: string
          category?:
            | "salaire"
            | "loyer"
            | "emprunt"
            | "electricite"
            | "eau"
            | "internet"
            | "carburant"
            | "maintenance"
            | "autre"
          amount?: number
          expense_date?: string
          created_by?: string | null
          notes?: string | null
        }
      }
      bank_entries: {
        Row: {
          id: string
          account_type: string
          description: string
          amount: number
          entry_date: string
          created_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          account_type: string
          description: string
          amount: number
          entry_date?: string
          created_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          account_type?: string
          description?: string
          amount?: number
          entry_date?: string
          created_by?: string | null
          notes?: string | null
        }
      }
      stock_logs: {
        Row: {
          id: string
          product_id: string
          action: string
          quantity_before: number | null
          quantity_after: number | null
          price_before: number | null
          price_after: number | null
          reference_id: string | null
          created_at: string
          created_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          product_id: string
          action: string
          quantity_before?: number | null
          quantity_after?: number | null
          price_before?: number | null
          price_after?: number | null
          reference_id?: string | null
          created_at?: string
          created_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          action?: string
          quantity_before?: number | null
          quantity_after?: number | null
          price_before?: number | null
          price_after?: number | null
          reference_id?: string | null
          created_at?: string
          created_by?: string | null
          notes?: string | null
        }
      }
    }
  }
}

export type UserRole = "admin" | "stock_manager" | "commercial" | "finance" | "visitor" | "seller"
export type Product = Database["public"]["Tables"]["products"]["Row"]
export type Client = Database["public"]["Tables"]["clients"]["Row"]
export type Supplier = Database["public"]["Tables"]["suppliers"]["Row"]
export type Sale = Database["public"]["Tables"]["sales"]["Row"]
export type Purchase = Database["public"]["Tables"]["purchases"]["Row"]
export type Expense = Database["public"]["Tables"]["expenses"]["Row"]
export type BankEntry = Database["public"]["Tables"]["bank_entries"]["Row"]
export type StockLog = Database["public"]["Tables"]["stock_logs"]["Row"]

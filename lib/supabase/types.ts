export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      bank_entries: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          description: string
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          contact: string
          created_at: string
          email: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          address?: string | null
          contact: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          address?: string | null
          contact?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string
          expense_date: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description: string
          expense_date: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string
          prix_achat: number
          prix_vente_detail_1: number
          prix_vente_detail_2: number | null
          prix_vente_gros: number | null
          quantity: number
          type: string | null
          unit: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name: string
          prix_achat: number
          prix_vente_detail_1: number
          prix_vente_detail_2?: number | null
          prix_vente_gros?: number | null
          quantity: number
          type?: string | null
          unit?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          prix_achat?: number
          prix_vente_detail_1?: number
          prix_vente_detail_2?: number | null
          prix_vente_gros?: number | null
          quantity?: number
          type?: string | null
          unit?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          created_at: string
          id: string
          product_id: string
          purchase_date: string
          quantity: number
          supplier_id: string
          total_amount: number
          unit_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          purchase_date: string
          quantity: number
          supplier_id: string
          total_amount: number
          unit_price: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          purchase_date?: string
          quantity?: number
          supplier_id?: string
          total_amount?: number
          unit_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          client_id: string
          created_at: string
          id: string
          product_id: string
          quantity_sold: number
          sale_date: string
          total_amount: number
          unit_price: number
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity_sold: number
          sale_date: string
          total_amount: number
          unit_price: number
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity_sold?: number
          sale_date?: string
          total_amount?: number
          unit_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact: string
          created_at: string
          email: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          address?: string | null
          contact: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          address?: string | null
          contact?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<PublicTableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][PublicTableName]["Row"]

export type Enums<PublicEnumName extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][PublicEnumName]

export type Product = Tables<"products">
export type Sale = Tables<"sales"> & { products?: Product; clients?: Client }
export type Purchase = Tables<"purchases"> & { products?: Product; suppliers?: Supplier }
export type Expense = Tables<"expenses">
export type Client = Tables<"clients">
export type Supplier = Tables<"suppliers">
export type BankEntry = Tables<"bank_entries">

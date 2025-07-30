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
    }
  }
}

export type UserRole = "admin" | "stock_manager" | "commercial" | "finance" | "visitor" | "seller"

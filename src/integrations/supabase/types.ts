export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      company_settings: {
        Row: {
          address: string | null
          company_name: string
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          phone: string | null
          tax_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          company_name?: string
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          tax_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          company_name?: string
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          tax_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department: string
          gender: string
          id: string
          last_updated: string | null
          name: string
          photo_url: string | null
          surname: string
          total_leave: number
          used_leave: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department?: string
          gender?: string
          id?: string
          last_updated?: string | null
          name: string
          photo_url?: string | null
          surname: string
          total_leave?: number
          used_leave?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string
          gender?: string
          id?: string
          last_updated?: string | null
          name?: string
          photo_url?: string | null
          surname?: string
          total_leave?: number
          used_leave?: number
          user_id?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string
          currency: string
          description: string
          due_date: string
          has_invoice: boolean
          id: string
          invoice_number: string | null
          notes: string | null
          remaining_amount: number
          status: string
          supplier_id: string | null
          supplier_name: string | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string
          due_date?: string
          has_invoice?: boolean
          id?: string
          invoice_number?: string | null
          notes?: string | null
          remaining_amount?: number
          status?: string
          supplier_id?: string | null
          supplier_name?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string
          due_date?: string
          has_invoice?: boolean
          id?: string
          invoice_number?: string | null
          notes?: string | null
          remaining_amount?: number
          status?: string
          supplier_id?: string | null
          supplier_name?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_records: {
        Row: {
          created_at: string
          days_used: number
          description: string | null
          employee_id: string
          end_date: string
          id: string
          start_date: string
        }
        Insert: {
          created_at?: string
          days_used: number
          description?: string | null
          employee_id: string
          end_date: string
          id?: string
          start_date: string
        }
        Update: {
          created_at?: string
          days_used?: number
          description?: string | null
          employee_id?: string
          end_date?: string
          id?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          brand: string | null
          category: string
          category_id: string
          cost: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          min_stock: number
          model: string | null
          name: string
          notes: string | null
          part_number: string
          price: number
          purchase_price: number
          sale_price: number
          sku: string | null
          stock: number
          stock_quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          category?: string
          category_id?: string
          cost?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          min_stock?: number
          model?: string | null
          name: string
          notes?: string | null
          part_number?: string
          price?: number
          purchase_price?: number
          sale_price?: number
          sku?: string | null
          stock?: number
          stock_quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string | null
          category?: string
          category_id?: string
          cost?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          min_stock?: number
          model?: string | null
          name?: string
          notes?: string | null
          part_number?: string
          price?: number
          purchase_price?: number
          sale_price?: number
          sku?: string | null
          stock?: number
          stock_quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          paid_by: string
          payment_date: string
          payment_method: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id: string
          notes?: string | null
          paid_by?: string
          payment_date?: string
          payment_method?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          paid_by?: string
          payment_date?: string
          payment_method?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          brand: string
          category: string
          created_at: string
          custom_brand: string | null
          discount: number
          id: string
          model: string
          price: number
          quantity: number
          quote_id: string
        }
        Insert: {
          brand?: string
          category?: string
          created_at?: string
          custom_brand?: string | null
          discount?: number
          id?: string
          model?: string
          price?: number
          quantity?: number
          quote_id: string
        }
        Update: {
          brand?: string
          category?: string
          created_at?: string
          custom_brand?: string | null
          discount?: number
          id?: string
          model?: string
          price?: number
          quantity?: number
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string
          currency: string
          customer_address: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          global_discount: number
          id: string
          notes: string | null
          quote_date: string
          quote_no: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
          vat_included: boolean
          vat_rate: number
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          global_discount?: number
          id?: string
          notes?: string | null
          quote_date?: string
          quote_no?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          vat_included?: boolean
          vat_rate?: number
        }
        Update: {
          created_at?: string
          currency?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          global_discount?: number
          id?: string
          notes?: string | null
          quote_date?: string
          quote_no?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          vat_included?: boolean
          vat_rate?: number
        }
        Relationships: []
      }
      return_requests: {
        Row: {
          account_holder: string | null
          application_date: string
          bank_branch: string | null
          bank_name: string | null
          created_at: string
          customer_address: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          customer_surname: string
          customer_tax_no: string | null
          customer_tc_no: string | null
          iban: string | null
          id: string
          invoice_date: string | null
          invoice_no: string | null
          notes: string | null
          product_brand: string | null
          product_condition: string | null
          product_model: string | null
          product_name: string | null
          product_price: number
          product_quantity: number
          product_serial_no: string | null
          return_reason: string | null
          status: string
          tax_amount: number
          total_refund: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          account_holder?: string | null
          application_date?: string
          bank_branch?: string | null
          bank_name?: string | null
          created_at?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_surname?: string
          customer_tax_no?: string | null
          customer_tc_no?: string | null
          iban?: string | null
          id?: string
          invoice_date?: string | null
          invoice_no?: string | null
          notes?: string | null
          product_brand?: string | null
          product_condition?: string | null
          product_model?: string | null
          product_name?: string | null
          product_price?: number
          product_quantity?: number
          product_serial_no?: string | null
          return_reason?: string | null
          status?: string
          tax_amount?: number
          total_refund?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          account_holder?: string | null
          application_date?: string
          bank_branch?: string | null
          bank_name?: string | null
          created_at?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_surname?: string
          customer_tax_no?: string | null
          customer_tc_no?: string | null
          iban?: string | null
          id?: string
          invoice_date?: string | null
          invoice_no?: string | null
          notes?: string | null
          product_brand?: string | null
          product_condition?: string | null
          product_model?: string | null
          product_name?: string | null
          product_price?: number
          product_quantity?: number
          product_serial_no?: string | null
          return_reason?: string | null
          status?: string
          tax_amount?: number
          total_refund?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          created_at: string
          id: string
          part_id: string | null
          part_name: string
          quantity: number
          sale_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          part_id?: string | null
          part_name?: string
          quantity?: number
          sale_id: string
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          id?: string
          part_id?: string | null
          part_name?: string
          quantity?: number
          sale_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          discount: number
          id: string
          net_amount: number
          notes: string | null
          payment_method: string
          sale_date: string
          status: string
          tax: number
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          discount?: number
          id?: string
          net_amount?: number
          notes?: string | null
          payment_method?: string
          sale_date?: string
          status?: string
          tax?: number
          total_amount?: number
          user_id: string
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          discount?: number
          id?: string
          net_amount?: number
          notes?: string | null
          payment_method?: string
          sale_date?: string
          status?: string
          tax?: number
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      sp_invoices: {
        Row: {
          created_at: string
          customer_address: string | null
          customer_name: string
          customer_tax_id: string | null
          discount_amount: number
          due_date: string | null
          id: string
          invoice_number: string
          notes: string | null
          sale_id: string | null
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_address?: string | null
          customer_name?: string
          customer_tax_id?: string | null
          discount_amount?: number
          due_date?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          sale_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_address?: string | null
          customer_name?: string
          customer_tax_id?: string | null
          discount_amount?: number
          due_date?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          sale_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sp_invoices_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

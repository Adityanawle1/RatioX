export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      waitlist: {
        Row: {
          id: string
          email: string
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          source?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          onboarded: boolean | null
          risk_profile: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          onboarded?: boolean | null
          risk_profile?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          onboarded?: boolean | null
          risk_profile?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      portfolios: {
        Row: {
          id: string
          user_id: string
          name: string
          currency: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          currency?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          currency?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      asset_targets: {
        Row: {
          id: string
          portfolio_id: string
          asset_class: string
          target_pct: number
          drift_threshold: number | null
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          asset_class: string
          target_pct: number
          drift_threshold?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          asset_class?: string
          target_pct?: number
          drift_threshold?: number | null
          created_at?: string
        }
      }
      holdings: {
        Row: {
          id: string
          portfolio_id: string
          user_id: string
          symbol: string
          name: string | null
          asset_class: string
          instrument_type: string | null
          quantity: number
          avg_buy_price: number
          current_price: number | null
          last_price_updated: string | null
          purchase_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          user_id: string
          symbol: string
          name?: string | null
          asset_class: string
          instrument_type?: string | null
          quantity?: number
          avg_buy_price?: number
          current_price?: number | null
          last_price_updated?: string | null
          purchase_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          user_id?: string
          symbol?: string
          name?: string | null
          asset_class?: string
          instrument_type?: string | null
          quantity?: number
          avg_buy_price?: number
          current_price?: number | null
          last_price_updated?: string | null
          purchase_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          holding_id: string | null
          portfolio_id: string
          user_id: string
          symbol: string
          transaction_type: 'buy' | 'sell'
          quantity: number
          price: number
          total_value: number | null
          notes: string | null
          transacted_at: string
        }
        Insert: {
          id?: string
          holding_id?: string | null
          portfolio_id: string
          user_id: string
          symbol: string
          transaction_type: 'buy' | 'sell'
          quantity: number
          price: number
          notes?: string | null
          transacted_at?: string
        }
        Update: {
          id?: string
          holding_id?: string | null
          portfolio_id?: string
          user_id?: string
          symbol?: string
          transaction_type?: 'buy' | 'sell'
          quantity?: number
          price?: number
          notes?: string | null
          transacted_at?: string
        }
      }
      rebalance_events: {
        Row: {
          id: string
          portfolio_id: string
          user_id: string
          snapshot: Json
          trades: Json
          status: 'suggested' | 'executed' | 'dismissed'
          health_score_before: number | null
          health_score_after: number | null
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          user_id: string
          snapshot: Json
          trades: Json
          status?: 'suggested' | 'executed' | 'dismissed'
          health_score_before?: number | null
          health_score_after?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          user_id?: string
          snapshot?: Json
          trades?: Json
          status?: 'suggested' | 'executed' | 'dismissed'
          health_score_before?: number | null
          health_score_after?: number | null
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          portfolio_id: string
          user_id: string
          asset_class: string
          drift_pct: number
          threshold_pct: number
          message: string | null
          read: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          user_id: string
          asset_class: string
          drift_pct: number
          threshold_pct: number
          message?: string | null
          read?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          user_id?: string
          asset_class?: string
          drift_pct?: number
          threshold_pct?: number
          message?: string | null
          read?: boolean | null
          created_at?: string
        }
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
  }
}

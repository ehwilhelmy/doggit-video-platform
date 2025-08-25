// Database type definitions for Supabase tables

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          phone: string | null
          pup_name: string | null
          training_goals: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          pup_name?: string | null
          training_goals?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          pup_name?: string | null
          training_goals?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'paused'
          billing_interval: 'month' | 'year' | null
          amount_cents: number | null
          currency: string | null
          trial_start: string | null
          trial_end: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          metadata: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'paused'
          billing_interval?: 'month' | 'year' | null
          amount_cents?: number | null
          currency?: string | null
          trial_start?: string | null
          trial_end?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'paused'
          billing_interval?: 'month' | 'year' | null
          amount_cents?: number | null
          currency?: string | null
          trial_start?: string | null
          trial_end?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
      video_progress: {
        Row: {
          id: string
          user_id: string
          video_id: string
          watched_duration_seconds: number | null
          total_duration_seconds: number | null
          progress_percentage: number | null
          completed: boolean | null
          first_watched_at: string | null
          last_watched_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          watched_duration_seconds?: number | null
          total_duration_seconds?: number | null
          progress_percentage?: number | null
          completed?: boolean | null
          first_watched_at?: string | null
          last_watched_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          watched_duration_seconds?: number | null
          total_duration_seconds?: number | null
          progress_percentage?: number | null
          completed?: boolean | null
          first_watched_at?: string | null
          last_watched_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_watchlist: {
        Row: {
          id: string
          user_id: string
          video_id: string
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          added_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_active_subscription: {
        Args: {
          user_uuid?: string
        }
        Returns: boolean
      }
      get_user_subscription: {
        Args: {
          user_uuid?: string
        }
        Returns: {
          id: string
          status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'paused'
          billing_interval: 'month' | 'year' | null
          amount_cents: number | null
          current_period_end: string | null
          cancel_at_period_end: boolean | null
        }[]
      }
      update_video_progress: {
        Args: {
          p_video_id: string
          p_watched_duration: number
          p_total_duration?: number
        }
        Returns: void
      }
      get_user_progress: {
        Args: {
          p_video_id?: string
        }
        Returns: {
          video_id: string
          watched_duration_seconds: number
          progress_percentage: number
          completed: boolean
          last_watched_at: string
        }[]
      }
    }
    Enums: {
      subscription_status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'paused'
      billing_interval: 'month' | 'year'
    }
  }
}

// Helper types for easier use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

export type VideoProgress = Database['public']['Tables']['video_progress']['Row']
export type VideoProgressInsert = Database['public']['Tables']['video_progress']['Insert']
export type VideoProgressUpdate = Database['public']['Tables']['video_progress']['Update']

export type UserWatchlist = Database['public']['Tables']['user_watchlist']['Row']
export type UserWatchlistInsert = Database['public']['Tables']['user_watchlist']['Insert']
export type UserWatchlistUpdate = Database['public']['Tables']['user_watchlist']['Update']
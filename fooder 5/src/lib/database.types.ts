// Fooder database types
// Replace this file by running:
//   npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > src/lib/database.types.ts

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
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          username: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          username?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          username?: string | null
          avatar_url?: string | null
        }
        Relationships: []
      }
      places: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          address: string
          latitude: number
          longitude: number
          image_url: string
          cuisine_type: string
          price_range: string
          rating_avg: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string
          address?: string
          latitude: number
          longitude: number
          image_url?: string
          cuisine_type?: string
          price_range?: string
          rating_avg?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          address?: string
          latitude?: number
          longitude?: number
          image_url?: string
          cuisine_type?: string
          price_range?: string
          rating_avg?: number
        }
        Relationships: []
      }
      swipes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          place_id: string
          direction: 'like' | 'pass'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          place_id: string
          direction: 'like' | 'pass'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          place_id?: string
          direction?: 'like' | 'pass'
        }
        Relationships: [
          {
            foreignKeyName: 'swipes_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'swipes_place_id_fkey'
            columns: ['place_id']
            referencedRelation: 'places'
            referencedColumns: ['id']
          }
        ]
      }
      visits: {
        Row: {
          id: string
          created_at: string
          user_id: string
          place_id: string
          rating: number
          review: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          place_id: string
          rating: number
          review?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          place_id?: string
          rating?: number
          review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'visits_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'visits_place_id_fkey'
            columns: ['place_id']
            referencedRelation: 'places'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      places_within_radius: {
        Args: {
          user_lat: number
          user_lng: number
          radius_km: number
        }
        Returns: {
          id: string
          created_at: string
          name: string
          description: string
          address: string
          latitude: number
          longitude: number
          image_url: string
          cuisine_type: string
          price_range: string
          rating_avg: number
          distance: number
        }[]
      }
    }
    Enums: Record<string, never>
  }
}

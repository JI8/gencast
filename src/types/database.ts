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
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          name?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string | null
        }
      }
      characters: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string
          role: string
          background: string
          voice_id: string | null
          user_id: string
          is_preset: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description: string
          role: string
          background: string
          voice_id?: string | null
          user_id: string
          is_preset?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string
          role?: string
          background?: string
          voice_id?: string | null
          user_id?: string
          is_preset?: boolean
        }
      }
      podcasts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          format: string
          user_id: string
          is_template: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          format: string
          user_id: string
          is_template?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          format?: string
          user_id?: string
          is_template?: boolean
        }
      }
      podcast_episodes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          podcast_id: string
          content: Json
          status: string
          audio_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          podcast_id: string
          content?: Json
          status?: string
          audio_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          podcast_id?: string
          content?: Json
          status?: string
          audio_url?: string | null
        }
      }
    }
  }
}

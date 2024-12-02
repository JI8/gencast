import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client-side Supabase client (use this in client components)
export const createBrowserClient = () => createClientComponentClient()

// Types for our database tables
export type Character = {
  id: string
  created_at: string
  name: string
  description: string
  role: string
  avatar: string
  traits: string[]
  show_count: number
  episode_count: number
  voice_settings: {
    pitch: number
    speed: number
    style: string
  }
  user_id: string
}

export type Topic = {
  id: string
  created_at: string
  name: string
  description: string
  tags: string[]
  sources: string[]
  show_count: number
  episode_count: number
  user_id: string
}

export type Show = {
  id: string
  created_at: string
  name: string
  description: string
  character_ids: string[]
  topic_ids: string[]
  episode_count: number
  user_id: string
}

export type Episode = {
  id: string
  created_at: string
  show_id: string
  title: string
  description: string
  audio_url: string
  duration: number
  status: 'draft' | 'generating' | 'published'
  user_id: string
}

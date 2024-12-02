import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { getTempUserId } from '@/lib/temp-user'

type PodcastEpisode = Database['public']['Tables']['podcast_episodes']['Row']
type ContentBlock = {
  id: string
  type: 'intro' | 'segment' | 'discussion' | 'outro'
  content: string
  duration?: number
}

type AudioSettings = {
  backgroundMusic: string
  musicVolume: number
  soundEffects: boolean
  effectsVolume: number
  masterVolume: number
  audioQuality: '128' | '256' | '320'
}

export function usePodcastEpisode(episodeId?: string) {
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (episodeId) {
      fetchEpisode(episodeId)
    }
  }, [episodeId])

  const fetchEpisode = async (id: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('podcast_episodes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setEpisode(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createEpisode = async (
    podcastId: string,
    title: string,
    description: string
  ) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('podcast_episodes')
        .insert({
          podcast_id: podcastId,
          title,
          description,
          content: {
            blocks: [],
            audioSettings: {
              backgroundMusic: 'none',
              musicVolume: 50,
              soundEffects: true,
              effectsVolume: 70,
              masterVolume: 100,
              audioQuality: '256'
            }
          },
          status: 'draft'
        })
        .select()
        .single()

      if (error) throw error

      setEpisode(data)
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateContent = async (
    blocks: ContentBlock[],
    audioSettings: AudioSettings
  ) => {
    if (!episode) return null

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('podcast_episodes')
        .update({
          content: {
            blocks,
            audioSettings
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', episode.id)
        .select()
        .single()

      if (error) throw error

      setEpisode(data)
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (status: string) => {
    if (!episode) return null

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('podcast_episodes')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', episode.id)
        .select()
        .single()

      if (error) throw error

      setEpisode(data)
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateAudioUrl = async (audioUrl: string) => {
    if (!episode) return null

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('podcast_episodes')
        .update({
          audio_url: audioUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', episode.id)
        .select()
        .single()

      if (error) throw error

      setEpisode(data)
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    episode,
    loading,
    error,
    createEpisode,
    updateContent,
    updateStatus,
    updateAudioUrl
  }
}

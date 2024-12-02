import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { getTempUserId } from '@/lib/temp-user'

type Podcast = Database['public']['Tables']['podcasts']['Row']
type PodcastWithEpisodeCount = Podcast & { episode_count: number }

export function usePodcasts() {
  const [podcasts, setPodcasts] = useState<PodcastWithEpisodeCount[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPodcasts()
  }, [])

  const fetchPodcasts = async () => {
    try {
      setLoading(true)
      const { data: podcastsData, error: podcastsError } = await supabase
        .from('podcasts')
        .select('*')
        .eq('user_id', getTempUserId())
        .order('created_at', { ascending: false })

      if (podcastsError) throw podcastsError

      // Get episode counts for each podcast
      const podcastsWithCounts = await Promise.all(
        (podcastsData || []).map(async (podcast) => {
          const { count, error: countError } = await supabase
            .from('podcast_episodes')
            .select('*', { count: 'exact', head: true })
            .eq('podcast_id', podcast.id)

          if (countError) throw countError

          return {
            ...podcast,
            episode_count: count || 0
          }
        })
      )

      setPodcasts(podcastsWithCounts)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createPodcast = async (
    title: string,
    description: string,
    format: string,
    isTemplate: boolean = false
  ) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('podcasts')
        .insert({
          title,
          description,
          format,
          user_id: getTempUserId(),
          is_template: isTemplate
        })
        .select()
        .single()

      if (error) throw error

      setPodcasts([{ ...data, episode_count: 0 }, ...podcasts])
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updatePodcast = async (
    id: string,
    updates: Partial<Omit<Podcast, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
  ) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('podcasts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', getTempUserId())
        .select()
        .single()

      if (error) throw error

      setPodcasts(podcasts.map(p => (p.id === id ? { ...data, episode_count: p.episode_count } : p)))
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const deletePodcast = async (id: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('podcasts')
        .delete()
        .eq('id', id)
        .eq('user_id', getTempUserId())

      if (error) throw error

      setPodcasts(podcasts.filter(p => p.id !== id))
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    podcasts,
    loading,
    error,
    createPodcast,
    updatePodcast,
    deletePodcast,
    refreshPodcasts: fetchPodcasts
  }
}

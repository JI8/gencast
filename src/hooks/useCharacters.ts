"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Character } from '@/types/character'
import { Database } from '@/types/database'

type DbCharacter = Database['public']['Tables']['characters']['Row']

const mapDbCharacterToCharacter = (dbCharacter: DbCharacter): Character => ({
  id: dbCharacter.id,
  name: dbCharacter.name,
  description: dbCharacter.description,
  role: dbCharacter.role,
  background: dbCharacter.background,
  voiceId: dbCharacter.voice_id || undefined,
  isPreset: dbCharacter.is_preset,
})

export function useCharacters(userId: string) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCharacters()
  }, [userId])

  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setCharacters(data.map(mapDbCharacterToCharacter))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createCharacter = async (characterData: Omit<Character, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .insert([
          {
            name: characterData.name,
            description: characterData.description,
            role: characterData.role,
            background: characterData.background,
            voice_id: characterData.voiceId,
            user_id: userId,
            is_preset: false,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setCharacters([mapDbCharacterToCharacter(data), ...characters])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const updateCharacter = async (id: string, characterData: Partial<Character>) => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .update({
          name: characterData.name,
          description: characterData.description,
          role: characterData.role,
          background: characterData.background,
          voice_id: characterData.voiceId,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setCharacters(
        characters.map((c) =>
          c.id === id ? mapDbCharacterToCharacter(data) : c
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const deleteCharacter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCharacters(characters.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    characters,
    loading,
    error,
    createCharacter,
    updateCharacter,
    deleteCharacter,
  }
}

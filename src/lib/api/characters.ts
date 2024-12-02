import { createBrowserClient, type Character } from '@/lib/supabase'

export async function getCharacters(userId: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Character[]
}

export async function getCharacter(id: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Character
}

export async function createCharacter(character: Omit<Character, 'id' | 'created_at'>) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('characters')
    .insert([character])
    .select()
    .single()

  if (error) throw error
  return data as Character
}

export async function updateCharacter(id: string, updates: Partial<Character>) {
  const supabase = createBrowserClient()
  
  // Remove any undefined values to avoid Supabase validation errors
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]) => value !== undefined)
  )

  const { data, error } = await supabase
    .from('characters')
    .update(cleanUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Character
}

export async function deleteCharacter(id: string) {
  const supabase = createBrowserClient()
  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', id)

  if (error) throw error
}

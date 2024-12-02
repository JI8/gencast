import { createBrowserClient, type Show } from '@/lib/supabase'

export async function getShows(userId: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Show[]
}

export async function getShow(id: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Show
}

export async function createShow(data: Omit<Show, 'id' | 'created_at'>) {
  try {
    const supabase = createBrowserClient()
    const { error, data: show } = await supabase
      .from('shows')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return show
  } catch (error) {
    console.error('Error creating show:', error)
    throw error
  }
}

export async function updateShow(id: string, data: Partial<Show>) {
  try {
    const supabase = createBrowserClient()
    // Clean undefined values from data
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    )

    const { error, data: show } = await supabase
      .from('shows')
      .update(cleanData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return show
  } catch (error) {
    console.error('Error updating show:', error)
    throw error
  }
}

export async function deleteShow(id: string) {
  try {
    const supabase = createBrowserClient()
    
    // First check if the show exists and belongs to the user
    const { data: show, error: fetchError } = await supabase
      .from('shows')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError
    if (!show) throw new Error('Show not found')

    // Then delete the show
    const { error: deleteError } = await supabase
      .from('shows')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError
    
    return true
  } catch (error) {
    console.error('Error deleting show:', error)
    throw error
  }
}

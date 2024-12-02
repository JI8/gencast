import { createBrowserClient, type Topic } from '@/lib/supabase'

export async function getTopics(userId: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Topic[]
}

export async function getTopic(id: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Topic
}

export async function createTopic(topic: Omit<Topic, 'id' | 'created_at'>) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('topics')
    .insert([topic])
    .select()
    .single()

  if (error) throw error
  return data as Topic
}

export async function updateTopic(id: string, updates: Partial<Topic>) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('topics')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Topic
}

export async function deleteTopic(id: string) {
  const supabase = createBrowserClient()
  const { error } = await supabase
    .from('topics')
    .delete()
    .eq('id', id)

  if (error) throw error
}

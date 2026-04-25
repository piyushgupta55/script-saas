'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPrompts() {
  const supabase = await createClient('admin')
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function createPrompt(prompt: { name: string; content: string }) {
  const supabase = await createClient('admin')
  const { error } = await supabase
    .from('prompts')
    .insert([prompt])

  if (error) throw error
  revalidatePath('/admin/prompts')
}

export async function updatePrompt(id: string, prompt: { name: string; content: string }) {
  const supabase = await createClient('admin')
  const { error } = await supabase
    .from('prompts')
    .update(prompt)
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/prompts')
}

export async function deletePrompt(id: string) {
  const supabase = await createClient('admin')
  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/prompts')
}

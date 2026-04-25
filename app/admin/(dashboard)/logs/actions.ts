'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getScriptLogs() {
  const supabase = await createClient('admin')
  const { data, error } = await supabase
    .from('script_logs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateLogRating(id: string, rating: number) {
  const supabase = await createClient('admin')
  const { error } = await supabase
    .from('script_logs')
    .update({ rating })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/logs')
}

export async function deleteLog(id: string) {
  const supabase = await createClient('admin')
  const { error } = await supabase
    .from('script_logs')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/logs')
}

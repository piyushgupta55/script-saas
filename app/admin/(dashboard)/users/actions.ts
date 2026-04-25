'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUsersMeta() {
  const supabase = await createClient('admin')
  const { data, error } = await supabase
    .from('users_meta')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateUserPlan(id: string, plan: 'free' | 'pro') {
  const supabase = await createClient('admin')
  const { error } = await supabase
    .from('users_meta')
    .update({ plan })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/users')
}

export async function toggleUserBlock(id: string, is_blocked: boolean) {
  const supabase = await createClient('admin')
  const { error } = await supabase
    .from('users_meta')
    .update({ is_blocked })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/users')
}

export async function resetUsageCount(id: string) {
  const supabase = await createClient('admin')
  const { error } = await supabase
    .from('users_meta')
    .update({ usage_count: 0 })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/users')
}

export async function deleteUserMeta(id: string) {
  const supabase = await createClient('admin')
  const { error } = await supabase
    .from('users_meta')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/users')
}

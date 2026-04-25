'use server'

import { createClient } from '@/lib/supabase/server'
import { KnowledgeChunk } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function getKnowledgeChunks() {
  const supabase = await createClient('admin')
  const { data, error } = await supabase
    .from('knowledge_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as KnowledgeChunk[]
}

export async function createKnowledgeChunk(chunk: Omit<KnowledgeChunk, 'id' | 'quality_score' | 'is_active'>) {
  const supabase = await createClient('admin')
  const { error } = await supabase
    .from('knowledge_items')
    .insert([{ ...chunk, quality_score: 0, is_active: true }])

  if (error) throw error
  revalidatePath('/admin/knowledge')
}

export async function updateKnowledgeChunk(id: string, chunk: Partial<KnowledgeChunk>) {
  const supabase = await createClient('admin')
  const { error } = await supabase
    .from('knowledge_items')
    .update(chunk)
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/knowledge')
}

export async function deleteKnowledgeChunk(id: string) {
  const supabase = await createClient('admin')
  // Soft delete as per requirements
  const { error } = await supabase
    .from('knowledge_items')
    .update({ is_active: false })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/knowledge')
}

export async function incrementQualityScore(id: string, currentScore: number) {
  const supabase = await createClient('admin')
  const { error } = await supabase
    .from('knowledge_items')
    .update({ quality_score: currentScore + 1 })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/knowledge')
}

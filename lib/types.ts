export type KnowledgeChunk = {
  id: string
  type: 'hook' | 'rule' | 'structure' | 'example'
  content: string
  category: 'short_form' | 'long_form' | 'general'
  tone: string | null
  source: string
  quality_score: number
  is_active: boolean
  created_at?: string
}

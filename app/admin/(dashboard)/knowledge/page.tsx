import { getKnowledgeChunks } from './actions'
import KnowledgeManager from '@/components/knowledge/KnowledgeManager'

export const dynamic = 'force-dynamic'

export default async function KnowledgePage() {
  const initialData = await getKnowledgeChunks()

  return (
    <div className="min-h-screen bg-zinc-950">
      <KnowledgeManager initialData={initialData} />
    </div>
  )
}

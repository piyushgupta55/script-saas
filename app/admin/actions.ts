'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient('admin')
  
  // 1. Total Users
  const { count: userCount } = await supabase
    .from('users_meta')
    .select('*', { count: 'exact', head: true })

  // 2. Total Scripts
  const { count: scriptCount } = await supabase
    .from('generated_scripts')
    .select('*', { count: 'exact', head: true })

  // 3. Knowledge Items
  const { count: knowledgeCount } = await supabase
    .from('knowledge_items')
    .select('*', { count: 'exact', head: true })

  // 4. Avg Rating (from script_logs)
  const { data: logs } = await supabase
    .from('script_logs')
    .select('rating')
    .not('rating', 'is', null)

  const avgRating = logs && logs.length > 0 
    ? (logs.reduce((acc, log) => acc + (log.rating || 0), 0) / logs.length).toFixed(1)
    : 'N/A'

  // 5. Recent Activity
  const { data: recentScripts } = await supabase
    .from('generated_scripts')
    .select('id, prompt, platform, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    totalUsers: userCount || 0,
    totalScripts: scriptCount || 0,
    totalKnowledge: knowledgeCount || 0,
    avgRating: avgRating,
    recentActivity: recentScripts || []
  }
}

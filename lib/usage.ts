import { createClient } from '@/lib/supabase/server'

export async function checkAndIncrementUsage(userId: string) {
  const supabase = await createClient('admin')
  
  // 1. Fetch user meta
  const { data: meta, error: fetchError } = await supabase
    .from('users_meta')
    .select('*')
    .eq('id', userId)
    .single()

  if (fetchError || !meta) {
    // If no meta exists, create one (default free)
    const { data: newUser, error: createError } = await supabase
      .from('users_meta')
      .insert([{ id: userId, plan: 'free', usage_count: 1, last_request_date: new Date().toISOString() }])
      .select()
      .single()
    
    if (createError) throw createError
    return { allowed: true, remaining: 4 }
  }

  // 2. Check if blocked
  if (meta.is_blocked) {
    return { allowed: false, error: 'Your account has been restricted by an administrator.' }
  }

  // 3. Check for daily reset
  const today = new Date().toISOString().split('T')[0]
  const lastDate = meta.last_request_date ? meta.last_request_date.split('T')[0] : null
  
  let currentUsage = meta.usage_count
  if (lastDate !== today) {
    currentUsage = 0
  }

  // 4. Check limits
  const LIMIT = meta.plan === 'pro' ? 1000 : 5
  if (currentUsage >= LIMIT) {
    return { allowed: false, error: `Daily limit reached (${LIMIT}/${LIMIT}). Upgrade to PRO for unlimited generation.` }
  }

  // 5. Increment usage
  const { error: updateError } = await supabase
    .from('users_meta')
    .update({ 
      usage_count: currentUsage + 1, 
      last_request_date: new Date().toISOString() 
    })
    .eq('id', userId)

  if (updateError) throw updateError

  return { allowed: true, remaining: LIMIT - (currentUsage + 1) }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { id, views, likes, saves } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Script ID is required' }, { status: 400 });
    }

    // STEP 1: Calculate Normalized Performance Score (Engagement-Based)
    // Formula: (Likes / Views) * 100 + (Saves / Views) * 200
    const viewsNum = parseInt(views) || 0;
    const likesNum = parseInt(likes) || 0;
    const savesNum = parseInt(saves) || 0;
    
    let performanceScore = 0;
    if (viewsNum > 0) {
      performanceScore = ((likesNum / viewsNum) * 100) + ((savesNum / viewsNum) * 200);
    }

    // STEP 2: Update Script Record
    const { data: script, error: fetchError } = await supabase
      .from('generated_scripts')
      .select('used_knowledge_ids')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from('generated_scripts')
      .update({
        views: viewsNum,
        likes: likesNum,
        saves: savesNum,
        performance_score: performanceScore
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // STEP 3: REWARD THE KNOWLEDGE (Self-Learning Loop)
    if (script?.used_knowledge_ids && script.used_knowledge_ids.length > 0) {
      // Increase success_score and usage_count for all items used
      // Note: We use a raw RPC or multiple updates if the client doesn't support bulk increment
      for (const knowledgeId of script.used_knowledge_ids) {
        await supabase.rpc('increment_knowledge_success', {
          p_id: knowledgeId,
          p_score: performanceScore
        });
      }
    }

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Metrics update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

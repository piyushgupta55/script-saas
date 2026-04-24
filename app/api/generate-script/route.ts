import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, platform, tone, length, language } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Step 1: Embed the user's prompt for semantic search
    let queryEmbedding = null;
    try {
      const embRes = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: prompt,
      });
      queryEmbedding = embRes.data[0].embedding;
    } catch (e) {
      console.error('Embedding error in generator:', e);
    }

    // Step 2: Fetch semantically relevant TOP-TIER knowledge
    const category = platform.toLowerCase().includes('reel') || platform.toLowerCase().includes('tiktok') || platform.toLowerCase().includes('short') 
      ? 'short_form' 
      : 'general';

    let dbKnowledge: any[] = [];
    if (queryEmbedding) {
      const { data, error } = await supabase.rpc('match_knowledge_items', {
        query_embedding: queryEmbedding,
        match_threshold: 0.2, // Catch anything even slightly relevant
        match_count: 30,
        p_category: category
      });
      if (!error) dbKnowledge = data;
    }

    // Fallback if vector search yields nothing or fails
    if (dbKnowledge.length === 0) {
      const { data } = await supabase
        .from('knowledge_items')
        .select('type, content')
        .eq('category', category)
        .order('quality_score', { ascending: false })
        .limit(30);
      dbKnowledge = data || [];
    }

    // Step 3: Organize fetched knowledge
    const rules = dbKnowledge?.filter(k => k.type === 'rule').map(k => k.content).slice(0, 10) || [];
    const structures = dbKnowledge?.filter(k => k.type === 'structure').map(k => k.content).slice(0, 3) || [];
    const hooks = dbKnowledge?.filter(k => k.type === 'hook').map(k => k.content).slice(0, 10) || [];

    const languageInstruction = language === 'Hinglish' 
      ? `OUTPUT LANGUAGE: Hinglish (Natural Mix of Hindi + English)
RULES FOR HINGLISH:
- Use Roman script only. No Hindi script.
- Mix Hindi and English naturally (creator style).
- Example: "Aaj maine ek mistake ki jo shayad tum bhi kar rahe ho..."`
      : 'OUTPUT LANGUAGE: English (Standard creator style)';

    const systemPrompt = `You are a world-class viral script writer for ${platform}. 
Your tone is ${tone}. 
Target length: ${length}.
${languageInstruction}

WORLD-CLASS WRITING RULES (Top Scored):
${rules.join('\n') || 'Write engagingly.'}

VIRAL STRUCTURES (Top Scored):
${structures.join('\n') || 'Standard hook, body, CTA.'}

INSPIRATIONAL HOOKS:
${hooks.join('\n')}

TASK:
1. Generate 5 VIRAL HOOK options (Shock, Curiosity, Question, Relatable Pain, Contrarian).
2. Generate one complete, high-retention SCRIPT.

RESPONSE FORMAT:
JSON object with {"hooks": {"shock": "...", ...}, "script": "..."}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `User Request: ${prompt}` },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response from AI');

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

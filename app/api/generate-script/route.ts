import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { checkAndIncrementUsage } from '@/lib/usage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, platform, tone, length, language, niche } = await req.json();

    // --- AUTHENTICATION ---
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
    }

    // --- NEW USAGE LIMIT SYSTEM ---
    const usage = await checkAndIncrementUsage(user.id);
    if (!usage.allowed) {
      return NextResponse.json({ 
        error: 'USAGE_LIMIT_REACHED', 
        message: usage.error 
      }, { status: 403 });
    }

    // --- UPGRADED: QUERY EXPANSION ---
    let expandedPrompt = prompt;
    try {
      const expansionRes = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a Viral Content Strategist. Expand the user input into a rich description of related keywords, underlying emotions, and viral hooks. Focus on "the hidden meaning" behind the words. Output ONLY the expanded text.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.4,
      });
      expandedPrompt = expansionRes.choices[0].message.content || prompt;
    } catch (e) {
      console.error('Query Expansion Error:', e);
    }

    // --- UPGRADED SPEED LAYER: MULTI-EMBEDDING CACHE ---
    let embeddings = { main: null, hook: null, emotion: null };
    const promptHash = prompt.trim().toLowerCase();
    
    try {
      const { data: cached } = await supabase
        .from('embedding_store')
        .select('emb_main, emb_hook, emb_emotion')
        .eq('prompt_hash', promptHash)
        .single();
      
      if (cached) {
        embeddings = {
          main: cached.emb_main,
          hook: cached.emb_hook,
          emotion: cached.emb_emotion
        };
      } else {
        const [mainRes, hookRes, emotionRes] = await Promise.all([
          openai.embeddings.create({ model: 'text-embedding-3-small', input: expandedPrompt }),
          openai.embeddings.create({ model: 'text-embedding-3-small', input: `viral hook for: ${expandedPrompt}` }),
          openai.embeddings.create({ model: 'text-embedding-3-small', input: `emotion in: ${expandedPrompt}` }),
        ]);

        embeddings = {
          main: mainRes.data[0].embedding as any,
          hook: hookRes.data[0].embedding as any,
          emotion: emotionRes.data[0].embedding as any
        };
        
        supabase.from('embedding_store').insert([{
          prompt_hash: promptHash,
          emb_main: embeddings.main,
          emb_hook: embeddings.hook,
          emb_emotion: embeddings.emotion,
          input_text: prompt
        }]).then(({ error }) => {
          if (error) console.error('Cache save error:', error);
        });
      }
    } catch (e) {
      console.error('Speed Layer Error:', e);
      const [mainRes, hookRes, emotionRes] = await Promise.all([
        openai.embeddings.create({ model: 'text-embedding-3-small', input: expandedPrompt }),
        openai.embeddings.create({ model: 'text-embedding-3-small', input: `viral hook for: ${expandedPrompt}` }),
        openai.embeddings.create({ model: 'text-embedding-3-small', input: `emotion in: ${expandedPrompt}` }),
      ]);
      embeddings = {
        main: mainRes.data[0].embedding as any,
        hook: hookRes.data[0].embedding as any,
        emotion: emotionRes.data[0].embedding as any
      };
    }

    // --- KNOWLEDGE RETRIEVAL ---
    const isShortForm = 
      platform.toLowerCase().includes('reel') || 
      platform.toLowerCase().includes('tiktok') || 
      platform.toLowerCase().includes('short') ||
      length === '30s' || 
      length === '60s';

    const category = isShortForm ? 'short_form' : 'general';

    const fetchItems = async (type: string, count: number) => {
      if (!embeddings.main) return [];
      const { data, error } = await supabase.rpc('match_knowledge_hybrid', {
        p_query_main: embeddings.main,
        p_query_hook: embeddings.hook,
        p_query_emotion: embeddings.emotion,
        p_match_count: count * 3,
        p_category: category,
        p_niche: niche || 'general',
        p_type: type
      });
      
      if (error || !data) return [];
      const uniqueStyles: Record<string, any> = {};
      for (const item of data) {
        const style = item.hook_style || item.id;
        if (!uniqueStyles[style]) uniqueStyles[style] = item;
      }
      return Object.values(uniqueStyles).slice(0, count);
    };

    const rawRules = await fetchItems('rule', 5);
    const rawStructures = await fetchItems('structure', 1);
    const rawHooks = await fetchItems('hook', 5);

    const rules = rawRules.map((r: any) => r.content);
    const structures = rawStructures.map((s: any) => s.content);
    const hooks = rawHooks.map((h: any) => h.content);

    const usedKnowledgeIds = [
      ...rawRules.map((r: any) => r.id),
      ...rawStructures.map((s: any) => s.id),
      ...rawHooks.map((h: any) => h.id)
    ];

    // --- PLANNING STEP ---
    const planningResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a World-Class Viral Content Strategist engineering a script for ${platform}. 
          Tone: ${tone}. Target Length: ${length}.
          Break the "AI Sameness" by planning a unique angle and structure.
          Return ONLY JSON: { "unique_angle": "...", "persona": "...", "recommended_style": "...", "emotional_angle": "...", "structure_plan": "...", "viral_triggers": [...] }`
        },
        { role: 'user', content: `Topic: ${prompt}\n\nKnowledge Context:\n${rules.join('\n')}\n${structures.join('\n')}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });
    
    const plan = JSON.parse(planningResponse.choices[0].message.content || '{}');

    // --- GENERATION STEP ---
    let wordCountGuideline = "";
    if (length === '30s') wordCountGuideline = "Target word count: 70-90 words. Keep it extremely fast-paced.";
    else if (length === '60s') wordCountGuideline = "Target word count: 140-170 words. Balanced pace with a clear middle.";
    else if (length === 'Long') wordCountGuideline = "Target word count: 600-1000 words. Deep dive, multiple sections, thorough explanation.";

    const currentLengthConstraint = `Target Length: ${length}. ${wordCountGuideline}`;
    const languageInstruction = language === 'Hinglish' 
      ? 'OUTPUT LANGUAGE: Hinglish (Natural Mix of Hindi + English). ROMAN SCRIPT ONLY.'
      : 'OUTPUT LANGUAGE: English (Sharp, Modern, No Fluff)';

    const systemPrompt = `You are writing as a ${plan.persona}. Target: ${platform}. Tone: ${tone}. 
    Length: ${currentLengthConstraint}. ${languageInstruction}
    Rules: ${rules.join('\n')}
    Structure: ${structures.join('\n')}
    Structure Plan: ${plan.structure_plan}
    
    CRITICAL FORMATTING RULES:
    1. USE ALL CAPS for the entire script content to maintain high energy.
    2. USE SCENE BRACKETS to structure the flow (e.g., [OPENING SCREEN], [NEXT], [CUT], [SCENE CHANGE], [FINAL CTA]).
    3. INJECT RELEVANT EMOJIS frequently to make it visually engaging and "viral".
    4. USE LONG DASHES "——" to separate distinct thoughts or scene transitions within the text.
    5. ${length === 'Long' ? 'The content should be detailed, structured, and informative while maintaining engagement.' : 'THE CONTENT MUST BE punchy, fast-paced, and optimized for high retention.'}
    
    RESPONSE FORMAT: JSON {"hooks": [...], "script": "..."}`;

    const generationResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Topic: ${prompt}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.85,
    });

    const finalResult = JSON.parse(generationResponse.choices[0].message.content || '{}');

    // --- PERFORMANCE FEEDBACK LOOP ---
    let scriptId = null;
    try {
      const { data } = await supabase.from('generated_scripts').insert([{
        prompt: prompt,
        platform: platform,
        tone: tone,
        length: length,
        language: language,
        hooks: finalResult.hooks,
        script: finalResult.script,
        unique_angle: plan.unique_angle,
        persona: plan.persona,
        hook_style: plan.recommended_style,
        emotional_angle: plan.emotional_angle,
        niche: niche,
        used_knowledge_ids: usedKnowledgeIds
      }]).select('id').single();
      if (data) scriptId = data.id;
    } catch (err) {}

    const usedKnowledge = [
      ...rawRules.map((r: any) => ({ content: r.content, source: r.source })),
      ...rawStructures.map((s: any) => ({ content: s.content, source: s.source })),
      ...rawHooks.map((h: any) => ({ content: h.content, source: h.source }))
    ];

    return NextResponse.json({ 
      ...finalResult, 
      id: scriptId, 
      remaining_credits: usage.remaining,
      applied_knowledge: usedKnowledge 
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

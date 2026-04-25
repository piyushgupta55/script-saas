import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, niche, tone, language } = await req.json();

    // Fetch top performing scripts for this niche to inspire ideas
    let nicheContext = '';
    try {
      const { data: topScripts } = await supabase
        .from('generated_scripts')
        .select('prompt, script, likes, saves')
        .eq('niche', niche)
        .order('saves', { ascending: false })
        .limit(5);
      
      if (topScripts && topScripts.length > 0) {
        nicheContext = topScripts.map(s => `Successful Topic: ${s.prompt}`).join('\n');
      }
    } catch (err) {
      console.error('Error fetching niche context:', err);
    }

    const systemPrompt = `You are a viral Content Strategist specialized in ${niche}.
    Your goal is to generate 10 VIRAL content ideas based on the user's goal: "${prompt}".
    
    NICHE CONTEXT (What worked before):
    ${nicheContext || 'No historical data yet.'}
    
    TONE: ${tone}
    LANGUAGE: ${language}
    
    IDEA REQUIREMENTS:
    - Each idea must be unique and highly shareable.
    - Focus on curiosity, shock, relatable pain, or high-value tips.
    - Each idea needs a Title, a Hook, and a brief Description of the angle.
    
    RESPONSE FORMAT:
    JSON object with:
    {
      "ideas": [
        {
          "title": "...",
          "hook": "...",
          "description": "..."
        }
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate 10 viral ideas for ${niche} focusing on: ${prompt}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.9, // Higher randomness for better ideas
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response from AI');

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Idea generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, knowledge, platform, tone, length, language } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Filter knowledge to avoid noise
    const selectedRules = knowledge?.rules?.slice(0, 8).join('\n') || 'Write engagingly.';
    const selectedStructures = knowledge?.structures?.slice(0, 3).join('\n') || 'Standard hook, body, CTA structure.';
    const hookInspiration = knowledge?.hooks?.slice(0, 10).join('\n') || '';

    const languageInstruction = language === 'Hinglish' 
      ? `OUTPUT LANGUAGE: Hinglish (Natural Mix of Hindi + English)
RULES FOR HINGLISH:
- Use Roman script only (no Hindi script/Devanagari).
- Mix Hindi and English naturally, the way creators speak on Instagram/YouTube.
- Avoid formal language. Keep it casual and conversational.
- Example Style: "Aaj maine ek mistake ki jo shayad tum bhi kar rahe ho..." or "Main poora din bas phone scroll karta raha..."`
      : 'OUTPUT LANGUAGE: English (Standard creator style)';

    const systemPrompt = `You are a world-class viral script writer for ${platform || 'short-form video'}. 
Your tone is ${tone || 'energetic and engaging'}. 
Target length: ${length || '60 seconds'}.
${languageInstruction}

SCRIPTRITING RULES TO FOLLOW:
${selectedRules}

STRUCTURES TO USE:
${selectedStructures}

INSPIRATIONAL HOOKS FROM DATABASE:
${hookInspiration}

TASK:
1. Generate 5 distinct VIRAL HOOK options based on the following categories: Shock, Curiosity, Question, Relatable Pain, and Contrarian.
2. Generate one complete, high-retention SCRIPT based on the user's prompt.

RESPONSE FORMAT:
You must return a JSON object with this exact structure:
{
  "hooks": {
    "shock": "...",
    "curiosity": "...",
    "question": "...",
    "relatable_pain": "...",
    "contrarian": "..."
  },
  "script": "..."
}`;

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

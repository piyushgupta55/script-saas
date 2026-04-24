import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, knowledge } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `You are a viral script writer. 
Use these rules:
${knowledge?.rules?.join('\n') || 'No specific rules provided.'}

Use these structures:
${knowledge?.structures?.join('\n') || 'No specific structures provided.'}

Use these hooks for inspiration:
${knowledge?.hooks?.join('\n') || 'No specific hooks provided.'}

Generate a viral script for the user's request.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    });

    return NextResponse.json({ script: response.choices[0].message.content });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

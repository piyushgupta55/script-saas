import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const systemPrompt = `You are a world-class Social Media Strategist.
    Your task is to REVERSE ENGINEER a viral transcript and explain the "DNA of its success".
    
    ANALYSIS REQUIREMENTS:
    1. HOOK TYPE: Identify the specific psychological trigger used in the first 3 seconds (e.g., Negative Constraint, Curiosity Gap, Shocking Fact).
    2. HOOK BREAKDOWN: Explain exactly why the first sentence works.
    3. STRUCTURE STEPS: Break the script down into its logical beats (e.g., 1. Hook, 2. Problem, 3. Solution, 4. Result).
    4. PSYCHOLOGY: Explain the underlying psychological reasons why this content went viral (e.g., it taps into the fear of missing out, or it provides a quick dopamine hit of knowledge).
    
    STRICT RULES:
    - Be sharp, technical, and analytical.
    - Avoid generic praise.
    - Focus on the "Science of Retention".
    
    RESPONSE FORMAT:
    JSON object with:
    {
      "analysis": {
        "hook_type": "...",
        "hook_breakdown": "...",
        "structure_steps": ["Step 1...", "Step 2..."],
        "psychology": "..."
      }
    }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Viral Transcript:\n${prompt}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response from AI');

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

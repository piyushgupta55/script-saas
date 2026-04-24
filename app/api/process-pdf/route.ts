// Forced rebuild to ensure latest pdf-parse fix is active
import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF using the new PDFParse API
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    let text = result.text;
    await parser.destroy();

    // Clean text
    text = text.replace(/\s+/g, ' ').trim();

    // Split into chunks (approx 2000 chars)
    const chunkSize = 2000;
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    const finalData = {
      hooks: [] as string[],
      rules: [] as string[],
      structures: [] as string[],
      examples: [] as string[],
    };

    // Process chunks with OpenAI
    for (const chunk of chunks) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are a strict data extraction engine designed to populate a structured database. 
Your task is to extract atomic script-writing knowledge from the given text and return it in a database-ready JSON format.`,
            },
            {
              role: 'user',
              content: `DATABASE SCHEMA:
Each item must follow this structure:
{
  "type": "hook | rule | structure | example",
  "content": "string (short, atomic, 1 idea only)",
  "category": "short_form | long_form | general",
  "tone": "optional (funny, serious, storytelling, etc or null)",
  "source": "string (book name)"
}

WHAT TO EXTRACT:
- Hooks → attention-grabbing lines or formulas
- Rules → clear writing principles
- Structures → storytelling frameworks or sequences
- Examples → only if clearly present

STRICT RULES:
- Extract ONLY what is explicitly written in the text
- DO NOT generate, infer, or hallucinate
- DO NOT rewrite creatively
- Each "content" must be SHORT (max 1–2 lines)
- One idea per item (atomic)
- DO NOT include explanations or paragraphs
- Skip anything unclear or vague
- Avoid duplicates within the same response

CATEGORY MAPPING:
- If content is for short videos → "short_form"
- If content is for long storytelling → "long_form"
- Otherwise → "general"

OUTPUT FORMAT (MANDATORY):
Return ONLY valid JSON array. No explanation. No markdown.

TEXT TO PROCESS:
${chunk}`,
            },
          ],
          response_format: { type: 'json_object' },
        });

        const content = response.choices[0].message.content;
        if (content) {
          const parsed = JSON.parse(content);
          const items = Array.isArray(parsed) ? parsed : (parsed.items || []);
          
          for (const item of items) {
            if (item.type === 'hook') finalData.hooks.push(item.content);
            if (item.type === 'rule') finalData.rules.push(item.content);
            if (item.type === 'structure') finalData.structures.push(item.content);
            if (item.type === 'example') finalData.examples.push(item.content);
          }
        }
      } catch (err) {
        console.error('Error processing chunk:', err);
        // Continue with next chunk
      }
    }

    // Remove duplicates
    finalData.hooks = Array.from(new Set(finalData.hooks));
    finalData.rules = Array.from(new Set(finalData.rules));
    finalData.structures = Array.from(new Set(finalData.structures));
    finalData.examples = Array.from(new Set(finalData.examples));

    // Save to Supabase (if configured)
    const sessionId = uuidv4();
    if (process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url') {
      const { error } = await supabaseAdmin
        .from('script_knowledge')
        .insert([
          {
            id: sessionId,
            hooks: finalData.hooks,
            rules: finalData.rules,
            structures: finalData.structures,
            examples: finalData.examples,
            created_at: new Date().toISOString(),
          },
        ]);
      
      if (error) {
        console.error('Supabase error:', error);
      }
    }

    return NextResponse.json({ sessionId, data: finalData });
  } catch (error: any) {
    console.error('Processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

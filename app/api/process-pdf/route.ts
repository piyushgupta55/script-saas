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
          model: 'gpt-4o', // Using gpt-4o as it's reliable for structured data
          messages: [
            {
              role: 'system',
              content: 'You are an expert script writing analyst. Extract useful script writing knowledge from the provided text.',
            },
            {
              role: 'user',
              content: `Extract script writing knowledge. Return ONLY a JSON object with this format:
{
  "hooks": ["hook 1", "hook 2"],
  "rules": ["rule 1", "rule 2"],
  "structures": ["structure 1", "structure 2"],
  "examples": ["example 1", "example 2"]
}

Text:
${chunk}`,
            },
          ],
          response_format: { type: 'json_object' },
        });

        const content = response.choices[0].message.content;
        if (content) {
          const parsed = JSON.parse(content);
          finalData.hooks.push(...(parsed.hooks || []));
          finalData.rules.push(...(parsed.rules || []));
          finalData.structures.push(...(parsed.structures || []));
          finalData.examples.push(...(parsed.examples || []));
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

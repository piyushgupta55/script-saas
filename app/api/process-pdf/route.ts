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
Your task is to extract atomic script-writing knowledge and rate its quality (1-100).`,
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
  "source": "string (book name)",
  "quality_score": number (1-100 based on virality and clarity)
}

STRICT RULES:
- Extract ONLY explicit knowledge.
- Rate quality_score based on how actionable and viral the advice is.
- Return ONLY a valid JSON array.

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
            // Validation
            if (!item.content || item.content.length < 5) continue;

            // Dedicated Scoring Pass (as requested: cheap + fast)
            let finalScore = 50; // Default
            try {
              const scoreResponse = await openai.chat.completions.create({
                model: 'gpt-4o-mini', // Using mini for speed and cost
                messages: [
                  {
                    role: 'system',
                    content: 'You are a strict evaluator for viral script writing knowledge. Score based on Clarity, Practicality, and Impact.',
                  },
                  {
                    role: 'user',
                    content: `Score this item (1-10): "${item.content}". Return ONLY JSON: {"score": number}`,
                  },
                ],
                response_format: { type: 'json_object' },
              });
              const scoreContent = JSON.parse(scoreResponse.choices[0].message.content || '{}');
              finalScore = (scoreContent.score || 5) * 10; // Normalize to 1-100
            } catch (err) {
              console.error('Scoring error:', err);
            }

            // Save to knowledge_items table (Atomic with Smart Deduplication)
            if (process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://ochjeurxllofgepawkvy.supabase.co') {
              // Smart Deduplication: Check for similar content
              const partialContent = item.content.slice(0, 20);
              const { data: similar } = await supabaseAdmin
                .from('knowledge_items')
                .select('id')
                .ilike('content', `%${partialContent}%`)
                .limit(1);

              if (!similar || similar.length === 0) {
                await supabaseAdmin
                  .from('knowledge_items')
                  .insert([{
                    type: item.type,
                    content: item.content,
                    category: item.category,
                    tone: item.tone,
                    source: item.source || 'uploaded_pdf',
                    quality_score: finalScore
                  }]);
              }
            }

            // Map to finalData for immediate UI response
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

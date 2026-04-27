import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { chunk, source, extractionPrompt } = await req.json()

    if (!chunk) {
      return NextResponse.json({ error: 'No chunk provided' }, { status: 400 })
    }

    const supabase = supabaseAdmin
    
    const defaultPrompt = `
      You are a high-precision data extraction engine. Your task is to analyze the provided text and extract "Viral Patterns" that can be used to write high-retention social media scripts.
      
      SCHEMA:
      Return a JSON object with a "patterns" key containing an array of objects:
      {
        "patterns": [
          {
            "type": "hook | rule | structure | example",
            "content": "the actual advice or pattern (atomic, 1 idea only)",
            "category": "short_form | long_form | general",
            "tone": "funny | serious | storytelling | aggressive | etc"
          }
        ]
      }

      RULES:
      - "hook": Catchy opening lines or concepts.
      - "rule": Strategic advice (e.g., "Don't use more than 3 adjectives in a hook").
      - "structure": Frameworks for content (e.g., "Problem -> Solution -> CTA").
      - "example": Concrete examples of the above.
      - If no patterns are found, return {"patterns": []}.
      - Return ONLY valid JSON.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: extractionPrompt || defaultPrompt },
        { role: 'user', content: chunk }
      ],
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0].message.content
    if (!content) {
      console.log('AI returned empty content for chunk')
      return NextResponse.json({ success: true, count: 0, debug: 'Empty AI response' })
    }

    let patterns: any[] = []
    try {
      const chunkResult = JSON.parse(content)
      // Robust pattern extraction: check common keys or direct array
      if (Array.isArray(chunkResult)) {
        patterns = chunkResult
      } else if (chunkResult.patterns && Array.isArray(chunkResult.patterns)) {
        patterns = chunkResult.patterns
      } else if (chunkResult.items && Array.isArray(chunkResult.items)) {
        patterns = chunkResult.items
      } else {
        // Search for any array property if we didn't find one yet
        const firstArray = Object.values(chunkResult).find(val => Array.isArray(val))
        if (firstArray) patterns = firstArray as any[]
      }
    } catch (e) {
      console.error('JSON Parse Error:', e, 'Content:', content)
      return NextResponse.json({ success: false, count: 0, error: 'JSON_PARSE_FAILED', contentSnippet: content.slice(0, 100) })
    }

    let count = 0
    let dbError = null

    if (patterns.length > 0) {
      const inputs = patterns.map((p: any) => p.content).filter(Boolean)
      
      let embeddings: any[] = []
      if (inputs.length > 0) {
        try {
          const embResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: inputs,
          })
          embeddings = embResponse.data.map(d => d.embedding)
        } catch (e: any) {
          console.error('Embedding Generation Error:', e)
          // We continue without embeddings if they fail, but log it
        }
      }

      const itemsToInsert = patterns
        .filter(p => p.content && p.content.length > 5) // Basic validation
        .map((pattern: any, index: number) => {
          const contentHash = crypto
            .createHash('sha256')
            .update(pattern.content.trim().toLowerCase())
            .digest('hex')

          return {
            content_hash: contentHash,
            type: pattern.type || 'rule',
            content: pattern.content,
            category: pattern.category || 'general',
            tone: pattern.tone || null,
            source: source || 'Uploaded PDF',
            quality_score: 70,
            embedding: embeddings[index] || null,
            embedding_main: embeddings[index] || null,
            embedding_hook: embeddings[index] || null,
            embedding_emotion: embeddings[index] || null
          }
        })

      if (itemsToInsert.length > 0) {
        const { error } = await supabase
          .from('knowledge_items')
          .upsert(itemsToInsert, { onConflict: 'content_hash' })
        
        if (!error) {
          count = itemsToInsert.length
        } else {
          console.error('Supabase Upsert Error:', error)
          dbError = error.message
        }
      }
    }

    return NextResponse.json({ 
      success: !dbError, 
      count, 
      error: dbError,
      found: patterns.length 
    })

  } catch (error: any) {
    console.error('Chunk Processing Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

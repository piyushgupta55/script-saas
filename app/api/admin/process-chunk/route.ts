import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { chunk, source, extractionPrompt } = await req.json()

    if (!chunk) {
      return NextResponse.json({ error: 'No chunk provided' }, { status: 400 })
    }

    const supabase = await createClient('admin')
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: extractionPrompt || 'Extract viral patterns from text.' },
        { role: 'user', content: chunk }
      ],
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0].message.content
    if (!content) {
      return NextResponse.json({ success: true, count: 0 })
    }

    const chunkResult = JSON.parse(content)
    const patterns = Array.isArray(chunkResult) ? chunkResult : (chunkResult.patterns || [])

    let count = 0
    for (const pattern of patterns) {
      const { error } = await supabase.from('knowledge_items').insert([{
        ...pattern,
        source: source || 'Uploaded PDF',
        quality_score: 0,
        is_active: true
      }])
      if (!error) count++
    }

    return NextResponse.json({ success: true, count })

  } catch (error: any) {
    console.error('Chunk Processing Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

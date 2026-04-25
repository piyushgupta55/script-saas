import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { PDFParse } from 'pdf-parse'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    // 0. Defensive Env Checks
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ 
        error: 'SERVER_CONFIGURATION_ERROR: Supabase environment variables are missing.' 
      }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const source = formData.get('source') as string

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const supabase = await createClient('admin')
    
    // 1. Get Extraction Prompt
    let extractionPrompt = `
      You are an expert content analyzer. Extract "Viral Patterns" from the text below.
      Patterns can be: Hooks, Rules, Structures, or Examples.
      Return ONLY a JSON array of objects: 
      [{"type": "hook|rule|structure|example", "content": "...", "category": "short_form|long_form|general", "tone": "..."}]
    `

    try {
      const { data: promptData } = await supabase
        .from('prompts')
        .select('content')
        .eq('name', 'extraction_prompt')
        .single()
      
      if (promptData?.content) {
        extractionPrompt = promptData.content
      }
    } catch (err) {
      console.warn('Could not fetch extraction_prompt from DB, using fallback.', err)
    }

    // 2. Parse PDF
    let text = ''
    try {
      const arrayBuffer = await file.arrayBuffer()
      const parser = new PDFParse({ data: arrayBuffer })
      const textResult = await parser.getText()
      text = textResult.text
      await parser.destroy()
    } catch (err: any) {
      console.error('PDF Parsing Error:', err)
      return NextResponse.json({ error: `PDF_PARSE_FAILED: ${err.message}` }, { status: 500 })
    }

    if (!text) {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 })
    }

    // 3. Chunk Text
    const chunkSize = 3000
    const chunks: string[] = []
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize))
    }

    let totalExtracted = 0

    // 4. Process Chunks
    for (let i = 0; i < chunks.length; i++) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: extractionPrompt },
            { role: 'user', content: chunks[i] }
          ],
          response_format: { type: 'json_object' }
        })

        const content = response.choices[0].message.content
        if (!content) continue

        const chunkResult = JSON.parse(content)
        const patterns = Array.isArray(chunkResult) ? chunkResult : (chunkResult.patterns || [])

        for (const pattern of patterns) {
          const { error } = await supabase.from('knowledge_items').insert([{
            ...pattern,
            source: source || file.name,
            quality_score: 0,
            is_active: true
          }])
          if (!error) totalExtracted++
        }
      } catch (e) {
        console.error(`Error processing chunk ${i}:`, e)
      }
    }

    return NextResponse.json({ 
      success: true, 
      totalExtracted,
      totalChunks: chunks.length 
    })

  } catch (error: any) {
    console.error('Global PDF Processing Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

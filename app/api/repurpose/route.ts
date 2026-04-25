import { createClient } from '@/lib/supabase/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, tone, language, niche } = await req.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Long-form script is required' }, { status: 400 });
    }

    const systemPrompt = `You are a world-class Content Repurposer. 
    Your task is to take a long-form YouTube script and transform it into a viral multi-platform content package.
    
    TONE: ${tone}
    NICHE: ${niche}
    LANGUAGE: ${language === 'Hinglish' ? 'Hinglish (Roman script, natural mix)' : 'English'}
    
    OUTPUT REQUIREMENTS:
    1. 5 REELS: Extract the most engaging, high-impact segments. Each must have a strong hook, body, and CTA.
    2. TWITTER THREAD: A 5-7 tweet thread summarizing the key value points in an engaging, scroll-stopping way.
    3. VIRAL CAPTION: A high-conversion Instagram/TikTok caption with emojis and hashtags.
    
    STRICT RULES:
    - Use Roman script only (no Hindi script).
    - Maintain the personality of a modern creator.
    - Focus on retention and shareability.
    
    RESPONSE FORMAT:
    JSON object with:
    {
      "reels": [{"title": "...", "script": "..."}], 
      "twitter_thread": "Tweet 1...\n\nTweet 2...", 
      "caption": "..."
    }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `YouTube Script:\n${prompt}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response from AI');

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Repurposing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const SYSTEM_PROMPT = `You are BuzzAI, the official AI assistant for BuzzLaunch Media.

About BuzzLaunch Media:
- A digital media and systems agency that helps businesses get seen, get heard, and work smarter
- Tagline: "Be Seen. Be Heard."
- Core message: "We help businesses get found, look credible and turn attention into customers"
- Founded by Victor O. Brien (Founder & CEO) and Wisdom (Co-founder & CTO)

Services:
1. DIGITAL — Websites, landing pages, mobile-first websites, digital presence, local/technical SEO, branding
2. MEDIA — Social media strategy, short-form content, creative campaigns, advertising creatives, content systems
3. SYSTEMS — Custom business tools, dashboards, customer portals, booking systems, workflow automation, AI-assisted systems

Products Built by BuzzLaunch:
- ViralForge AI: https://viral-forge-ai-omega.vercel.app/
- BetaBook: https://ibetabook.vercel.app/
- Custom Business Systems: tailored software built around a company's workflow

Contact:
- Email: buzzlaunchmedia@gmail.com
- Phone/WhatsApp: 07066916150
- Social: @buzz_medialaunch across platforms

Guidelines:
- Be helpful, professional, and direct
- Focus on how BuzzLaunch can help the user's business
- Never invent pricing, statistics, client names, or guarantees
- Never expose admin data, applicant information, or private backend data
- If asked about pricing, say pricing is customized per project and encourage contact
- If asked about jobs/joining, direct to the Join BuzzLaunch page
- Keep responses concise and actionable
- You can help with questions about services, getting started, the team, products, and how to contact BuzzLaunch`;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
  const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

  const { messages } = await req.json();

  console.log('BuzzAI request with', messages?.length, 'messages');

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'google/gemini-3-flash-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('AI error:', error);
    return new Response(JSON.stringify({ error: 'AI service error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(response.body, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
});

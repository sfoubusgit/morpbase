/**
 * Vercel serverless proxy for LLM synthesis (production).
 *
 * The browser posts an OpenAI-format chat body to /api/llm; this injects the
 * OpenRouter key (from the OPENROUTER_KEY env var set in the Vercel dashboard)
 * and forwards to OpenRouter. The key never reaches the client bundle.
 *
 * In local dev this file is unused — the Vite /llm proxy handles injection.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  const key = process.env.OPENROUTER_KEY;
  if (!key) {
    res.status(500).json({ error: 'OPENROUTER_KEY not configured' });
    return;
  }
  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        'HTTP-Referer': 'https://morpbase.ai',
        'X-Title': 'MorpBase',
      },
      body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
    });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', 'application/json');
    res.send(text);
  } catch (e) {
    res.status(502).json({ error: String(e) });
  }
}

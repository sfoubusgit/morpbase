// Cloudflare Worker — free-model LLM proxy for MorpBase synthesis.
//
// Why: the deployed site is static (GitHub Pages), and the OpenRouter key must
// never ship in the browser bundle. This Worker holds the key server-side, adds
// CORS so any origin can call it, and FORCES a free model (so even if the URL
// leaks, nobody can spend money on paid models).
//
// Deploy once (free):
//   1. dash.cloudflare.com -> Workers & Pages -> Create -> paste this file,
//      or:  npx wrangler deploy workers/llm-proxy.js --name morpbase-llm
//   2. Set variables (Worker -> Settings -> Variables):
//        OPENROUTER_KEY  = <your OpenRouter key>      (Encrypt / Secret)
//        FREE_MODEL      = openai/gpt-oss-20b:free     (plain, optional)
//        ALLOWED_ORIGIN  = https://<your-site-origin>  (plain, optional CORS lock)
//   3. Copy the Worker URL, e.g. https://morpbase-llm.<acct>.workers.dev
//   4. Build the app pointing at it:
//        VITE_LLM_URL=https://morpbase-llm.<acct>.workers.dev npm run build
//
// In dev you don't need this — the Vite /llm proxy handles it.

const FREE_MODEL_DEFAULT = 'openai/gpt-oss-20b:free';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = env.ALLOWED_ORIGIN || origin || '*';
    const cors = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });

    // Optional origin lock — only the configured site (and dev localhost) may call.
    if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN && !origin.startsWith('http://localhost')) {
      return new Response('Forbidden origin', { status: 403, headers: cors });
    }
    if (!env.OPENROUTER_KEY) return new Response('Proxy not configured', { status: 500, headers: cors });

    let body;
    try { body = await request.json(); } catch { return new Response('Bad JSON', { status: 400, headers: cors }); }

    // Force a free model regardless of what the client asked for.
    body.model = env.FREE_MODEL || FREE_MODEL_DEFAULT;
    if (!body.max_tokens) body.max_tokens = 400;

    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': corsOrigin,
        'X-Title': 'MorpBase',
      },
      body: JSON.stringify(body),
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  },
};

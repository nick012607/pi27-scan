// PI27 scan-proxy — met slot: alleen de PI27-app mag deze worker gebruiken.
export default {
  async fetch(request, env) {
    const ALLOWED = 'https://nick012607.github.io';
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('POST only', { status: 405, headers: cors });
    if (origin !== ALLOWED) {
      return new Response(JSON.stringify({ error: { message: 'Deze proxy werkt alleen voor de PI27-app.' } }),
        { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    const body = await request.text();
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body
    });
    return new Response(await r.text(), { status: r.status,
      headers: { ...cors, 'Content-Type': 'application/json' } });
  }
};

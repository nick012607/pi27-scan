// Cloudflare Worker: veilige proxy voor de AI-fotoscan in de losse app/PWA-versie.
// 1) Maak gratis account op workers.cloudflare.com  2) Nieuwe Worker, plak deze code
// 3) Voeg in Settings > Variables een secret toe: ANTHROPIC_API_KEY (van console.anthropic.com)
// 4) Deploy; vul de Worker-URL in bij SCAN_PROXY_URL bovenin index.html
export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('POST only', { status: 405, headers: cors });
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

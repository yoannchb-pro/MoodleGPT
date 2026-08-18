const http = require('http');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 8787);
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';

function sendCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function json(res, statusCode, data) {
  sendCors(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function stripHtml(value) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseDuckDuckGoResults(html) {
  const results = [];
  const blockRegex = /<div class="result[^"]*".*?<\/div>\s*<\/div>\s*<\/div>/gims;
  const titleRegex = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i;
  const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i;

  for (const block of html.match(blockRegex) || []) {
    const titleMatch = block.match(titleRegex);
    if (!titleMatch) continue;

    const [, url, titleHtml] = titleMatch;
    const snippetMatch = block.match(snippetRegex);

    results.push({
      title: stripHtml(titleHtml),
      url,
      snippet: snippetMatch ? stripHtml(snippetMatch[1]) : ''
    });

    if (results.length >= 5) break;
  }

  return results;
}

const server = http.createServer(async (req, res) => {
  sendCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  if (reqUrl.pathname === '/search') {
    try {
      const query = reqUrl.searchParams.get('q') || '';
      if (!query) {
        json(res, 400, { error: 'Missing q query parameter' });
        return;
      }

      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const searchResponse = await fetch(searchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        }
      });

      const html = await searchResponse.text();
      if (!searchResponse.ok) {
        json(res, searchResponse.status, { error: html || searchResponse.statusText });
        return;
      }

      json(res, 200, {
        query,
        results: parseDuckDuckGoResults(html)
      });
      return;
    } catch (error) {
      json(res, 500, {
        error: error instanceof Error ? error.message : String(error)
      });
      return;
    }
  }

  const upstreamBase = OLLAMA_BASE_URL.endsWith('/') ? OLLAMA_BASE_URL : `${OLLAMA_BASE_URL}/`;
  const upstreamUrl = new URL(reqUrl.pathname.replace(/^\//, '') + reqUrl.search, upstreamBase);

  try {
    const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await readBody(req);
    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        Authorization: req.headers.authorization || ''
      },
      body: body && body.length > 0 ? body : undefined
    });

    const responseText = await upstreamResponse.text();
    res.writeHead(upstreamResponse.status, {
      'Content-Type': upstreamResponse.headers.get('content-type') || 'application/json'
    });
    res.end(responseText);
  } catch (error) {
    json(res, 500, {
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

server.listen(PORT, () => {
  console.log(`[ollama-proxy] listening on http://127.0.0.1:${PORT}`);
  console.log(`[ollama-proxy] forwarding to ${OLLAMA_BASE_URL}/v1`);
});

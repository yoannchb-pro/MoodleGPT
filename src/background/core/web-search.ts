import type Config from '../types/config';

type WebSearchResult = {
  title: string;
  url: string;
  snippet: string;
};

function stripHtml(text: string) {
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function webSearch(query: string, _config: Config): Promise<WebSearchResult[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Web search failed: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const results: WebSearchResult[] = [];
  const itemRegex =
    /<div class="result results_links.*?">[\s\S]*?<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;

  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(html)) !== null) {
    const [, rawUrl, rawTitle, rawSnippet] = match;
    if (!rawUrl || !rawTitle) continue;
    results.push({
      title: stripHtml(rawTitle),
      url: rawUrl,
      snippet: stripHtml(rawSnippet)
    });
    if (results.length >= 5) break;
  }

  return results;
}

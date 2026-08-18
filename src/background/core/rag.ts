import type Config from '../types/config';

type StoredDocument = {
  id: string;
  name: string;
  size: number;
  type: string;
  chunks: string[];
  createdAt: number;
};

type RagChunk = {
  score: number;
  text: string;
  source: string;
};

function tokenize(text: string) {
  return (text.toLowerCase().match(/[a-z0-9]+/g) || []).filter(token => token.length > 2);
}

function scoreChunk(queryTokens: string[], chunk: string) {
  const chunkTokens = tokenize(chunk);
  if (!chunkTokens.length) return 0;

  let score = 0;
  const counts = new Map<string, number>();
  for (const token of chunkTokens) counts.set(token, (counts.get(token) || 0) + 1);

  for (const token of queryTokens) {
    const count = counts.get(token);
    if (count) score += count;
  }

  return score;
}

export async function buildRagContext(question: string, config: Config) {
  if (!config.ragDocuments) return '';

  const { moodleGPTDocuments } = (await chrome.storage.local.get(['moodleGPTDocuments'])) as {
    moodleGPTDocuments?: StoredDocument[];
  };

  if (!moodleGPTDocuments?.length) return '';

  const queryTokens = tokenize(question);
  const scored: RagChunk[] = [];

  for (const doc of moodleGPTDocuments) {
    for (const chunk of doc.chunks) {
      const score = scoreChunk(queryTokens, chunk);
      if (score > 0) {
        scored.push({ score, text: chunk, source: doc.name });
      }
    }
  }

  const top = scored.sort((a, b) => b.score - a.score).slice(0, 4);
  if (!top.length) return '';

  return [
    'Uploaded document context:',
    ...top.map(
      (chunk, index) =>
        `${index + 1}. Source: ${chunk.source}\n${chunk.text.slice(0, 1400)}`
    )
  ].join('\n\n');
}

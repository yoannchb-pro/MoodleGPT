type BestResponse = {
  similarity: number;
  value: string | null;
  element: HTMLElement | null;
};

type ResponsesBySimilarity = {
  similarity: number;
  value: string;
  element: HTMLElement;
};

/**
 * Calculate the levenshtein distance between two sentence
 * @param str1
 * @param str2
 * @returns
 */
function levenshteinDistance(str1: string, str2: string) {
  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;

  const matrix: number[][] = [];
  const str1WithoutSpaces = str1.replace(/\s+/, '');
  const str2WithoutSpaces = str2.replace(/\s+/, '');

  for (let i = 0; i <= str1WithoutSpaces.length; ++i) {
    matrix.push([i]);
    for (let j = 1; j <= str2WithoutSpaces.length; ++j) {
      matrix[i][j] =
        i === 0
          ? j
          : Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + (str1WithoutSpaces[i - 1] === str2WithoutSpaces[j - 1] ? 0 : 1)
            );
    }
  }

  return matrix[str1WithoutSpaces.length][str2WithoutSpaces.length];
}

/**
 * Calculate the similarity between two sentences from 0 to 1 (best)
 * @param str1
 * @param str2
 * @returns
 */
function sentenceSimilarity(str1: string, str2: string) {
  const longerLength = str1.length > str2.length ? str1.length : str2.length;
  if (longerLength === 0) return 1;
  return (longerLength - levenshteinDistance(str1, str2)) / longerLength;
}

/**
 * Pick the best sentence that correspond to the answer
 * @param arr
 * @param answer
 * @returns
 */
export function pickBestReponse(
  answer: string,
  arr: { element: HTMLElement; value: string }[]
): BestResponse {
  let bestResponse: BestResponse = {
    element: null,
    similarity: 0,
    value: null
  };
  for (const obj of arr) {
    const similarity = sentenceSimilarity(obj.value, answer);
    if (similarity === 1) {
      return { element: obj.element, value: obj.value, similarity };
    }
    if (similarity > bestResponse.similarity) {
      bestResponse = { element: obj.element, value: obj.value, similarity };
    }
  }
  return bestResponse;
}

/**
 * Return the sentences sorted by score with a score superior or equal to what is asked
 * @param answer
 * @param arr
 * @param score
 * @returns
 */
export function pickResponsesWithSimilarityGreaterThan(
  answer: string,
  arr: { element: HTMLElement; value: string }[],
  score: number
): ResponsesBySimilarity[] {
  const responses: ResponsesBySimilarity[] = [];
  for (const obj of arr) {
    const similarity = sentenceSimilarity(obj.value, answer);
    if (similarity >= score)
      responses.push({
        similarity,
        value: obj.value,
        element: obj.element
      });
  }
  return responses.sort((a, b) => a.similarity - b.similarity);
}

/**
 * Convert a number to a readable string pourcentage
 * @param similarity
 */
export function toPourcentage(similarity: number): string {
  return Math.round(similarity * 100 * 100) / 100 + '%';
}

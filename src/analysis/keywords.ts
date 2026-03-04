import { Keyword, KeywordOptions } from '../types';
import { tokenizeWords } from '../core';
import { STOPWORDS } from '../data/stopwords';

export function keywords(text: string, options?: KeywordOptions): Keyword[] {
  const topN = options?.topN ?? 10;
  const minLength = options?.minLength ?? 3;

  const allWords = tokenizeWords(text);
  if (allWords.length === 0) return [];

  const totalWords = allWords.length;
  const lowered = allWords.map(w => w.toLowerCase());

  const filtered = lowered.filter(w => w.length >= minLength && !STOPWORDS.has(w));
  if (filtered.length === 0) return [];

  const totalFiltered = filtered.length;

  const freq = new Map<string, number>();
  for (const w of filtered) {
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }

  const results: Keyword[] = [];
  for (const [word, count] of freq) {
    const tf = count / totalFiltered;
    const lengthWeight = Math.max(0, 1 + Math.log(word.length / 3));
    const score = tf * lengthWeight;
    const density = (count / totalWords) * 100;
    results.push({ word, score, count, density });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topN);
}

import { KeywordDensityResult, DensityEntry } from '../types';
import { tokenizeWords } from '../core';
import { STOPWORDS } from '../data/stopwords';

export function density(text: string): KeywordDensityResult {
  const allWords = tokenizeWords(text).map(w => w.toLowerCase());

  if (allWords.length === 0) {
    return { unigrams: [], bigrams: [], trigrams: [] };
  }

  const totalWords = allWords.length;

  // Unigrams: exclude stopwords
  const unigramFreq = new Map<string, number>();
  for (const w of allWords) {
    if (!STOPWORDS.has(w)) {
      unigramFreq.set(w, (unigramFreq.get(w) ?? 0) + 1);
    }
  }
  const unigrams: DensityEntry[] = [];
  for (const [word, count] of unigramFreq) {
    unigrams.push({ text: word, count, density: (count / totalWords) * 100 });
  }
  unigrams.sort((a, b) => b.count - a.count);

  // Bigrams
  const bigramFreq = new Map<string, number>();
  for (let i = 0; i < allWords.length - 1; i++) {
    if (STOPWORDS.has(allWords[i]) && STOPWORDS.has(allWords[i + 1])) continue;
    const bigram = `${allWords[i]} ${allWords[i + 1]}`;
    bigramFreq.set(bigram, (bigramFreq.get(bigram) ?? 0) + 1);
  }
  const totalBigrams = Math.max(1, allWords.length - 1);
  const bigrams: DensityEntry[] = [];
  for (const [phrase, count] of bigramFreq) {
    bigrams.push({ text: phrase, count, density: (count / totalBigrams) * 100 });
  }
  bigrams.sort((a, b) => b.count - a.count);

  // Trigrams
  const trigramFreq = new Map<string, number>();
  for (let i = 0; i < allWords.length - 2; i++) {
    if (STOPWORDS.has(allWords[i]) && STOPWORDS.has(allWords[i + 1]) && STOPWORDS.has(allWords[i + 2])) continue;
    const trigram = `${allWords[i]} ${allWords[i + 1]} ${allWords[i + 2]}`;
    trigramFreq.set(trigram, (trigramFreq.get(trigram) ?? 0) + 1);
  }
  const totalTrigrams = Math.max(1, allWords.length - 2);
  const trigrams: DensityEntry[] = [];
  for (const [phrase, count] of trigramFreq) {
    trigrams.push({ text: phrase, count, density: (count / totalTrigrams) * 100 });
  }
  trigrams.sort((a, b) => b.count - a.count);

  return {
    unigrams: unigrams.slice(0, 20),
    bigrams: bigrams.slice(0, 20),
    trigrams: trigrams.slice(0, 20),
  };
}

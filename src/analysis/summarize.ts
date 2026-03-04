import { SummaryResult, SummaryOptions } from '../types';
import { tokenizeWords, tokenizeSentences } from '../core';
import { STOPWORDS } from '../data/stopwords';

export function summarize(text: string, options?: SummaryOptions): SummaryResult {
  const numSentences = options?.sentences ?? 3;

  const sentences = tokenizeSentences(text);
  if (sentences.length === 0) {
    return { sentences: [], ratio: 0 };
  }

  const totalWords = tokenizeWords(text).length;

  // If sentence count <= requested, return all
  if (sentences.length <= numSentences) {
    const summaryWords = sentences.reduce((sum, s) => sum + tokenizeWords(s).length, 0);
    return {
      sentences: [...sentences],
      ratio: totalWords > 0 ? summaryWords / totalWords : 0,
    };
  }

  // Compute word frequencies across full document (lowercase, exclude stopwords)
  const allWords = tokenizeWords(text).map(w => w.toLowerCase());
  const wordFreq = new Map<string, number>();
  for (const w of allWords) {
    if (!STOPWORDS.has(w)) {
      wordFreq.set(w, (wordFreq.get(w) ?? 0) + 1);
    }
  }

  // Score each sentence
  interface ScoredSentence {
    text: string;
    index: number;
    score: number;
    wordCount: number;
  }

  const scored: ScoredSentence[] = [];
  const total = sentences.length;

  for (let i = 0; i < total; i++) {
    const sent = sentences[i];
    const words = tokenizeWords(sent);
    const wc = words.length;

    // Filter out fragments
    if (wc < 4) continue;

    // a. Keyword frequency score
    const lowerWords = words.map(w => w.toLowerCase());
    let freqSum = 0;
    for (const w of lowerWords) {
      if (!STOPWORDS.has(w)) {
        freqSum += wordFreq.get(w) ?? 0;
      }
    }
    const keywordScore = freqSum / wc;

    // Normalize keyword score: divide by max possible (max freq)
    const maxFreq = Math.max(1, ...wordFreq.values());
    const normalizedKeyword = keywordScore / maxFreq;

    // b. Position score
    let positionScore: number;
    if (i === 0) {
      positionScore = 1.0;
    } else if (i === total - 1) {
      positionScore = 0.8;
    } else if (i === 1) {
      positionScore = 0.7;
    } else {
      // Linear scale from 0.5 to 0.2 for positions 2 to total-2
      const range = Math.max(1, total - 3);
      positionScore = 0.5 - ((i - 2) / range) * 0.3;
    }

    // c. Sentence length score
    let lengthScore: number;
    if (wc >= 15 && wc <= 25) {
      lengthScore = 1.0;
    } else if (wc < 15) {
      lengthScore = Math.max(0.2, wc / 15);
    } else {
      // wc > 25
      lengthScore = Math.max(0.2, 1.0 - (wc - 25) / 50);
    }

    const totalScore = 0.4 * normalizedKeyword + 0.3 * positionScore + 0.3 * lengthScore;

    scored.push({ text: sent, index: i, score: totalScore, wordCount: wc });
  }

  // Sort by score descending, take top N
  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, numSentences);

  // Re-sort by original position
  selected.sort((a, b) => a.index - b.index);

  const summaryWords = selected.reduce((sum, s) => sum + s.wordCount, 0);

  return {
    sentences: selected.map(s => s.text),
    ratio: totalWords > 0 ? summaryWords / totalWords : 0,
  };
}

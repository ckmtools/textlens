import { SentimentResult } from '../types';
import { tokenizeWords } from '../core';
import { AFINN } from '../data/afinn';

export function sentiment(text: string): SentimentResult {
  const words = tokenizeWords(text).map(w => w.toLowerCase());
  const totalWords = words.length;

  if (totalWords === 0) {
    return {
      score: 0,
      comparative: 0,
      label: 'neutral',
      confidence: 0,
      positive: [],
      negative: [],
    };
  }

  let rawScore = 0;
  const positiveSet = new Set<string>();
  const negativeSet = new Set<string>();
  let matchedCount = 0;

  for (const word of words) {
    const value = AFINN[word];
    if (value !== undefined) {
      rawScore += value;
      matchedCount++;
      if (value > 0) positiveSet.add(word);
      else if (value < 0) negativeSet.add(word);
    }
  }

  const comparative = rawScore / totalWords;
  const normalizedScore = Math.max(-1, Math.min(1, comparative / 3));
  const label: SentimentResult['label'] =
    comparative > 0.05 ? 'positive' :
    comparative < -0.05 ? 'negative' :
    'neutral';
  const confidence = Math.min(1, matchedCount / totalWords);

  return {
    score: normalizedScore,
    comparative,
    label,
    confidence,
    positive: Array.from(positiveSet),
    negative: Array.from(negativeSet),
  };
}

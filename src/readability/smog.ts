import { ReadabilityScore } from '../types.js';
import { tokenizeWords, tokenizeSentences } from '../core/tokenizer.js';
import { countSyllables } from '../core/syllables.js';

export function smogIndex(text: string): ReadabilityScore {
  const words = tokenizeWords(text);
  const sentenceCount = Math.max(1, tokenizeSentences(text).length);
  const wordCount = words.length;

  if (wordCount === 0) {
    return { formula: 'SMOG Index', score: 0, grade: 0, interpretation: 'N/A' };
  }

  let polysyllableCount = 0;
  for (const word of words) {
    if (countSyllables(word) >= 3) {
      polysyllableCount++;
    }
  }

  const raw = 3 + Math.sqrt(polysyllableCount * (30 / sentenceCount));

  const score = Math.max(0, Math.round(raw * 10) / 10);
  const grade = Math.round(score);

  let interpretation: string;
  if (grade <= 0) {
    interpretation = 'Kindergarten';
  } else if (grade <= 12) {
    interpretation = `${grade}${ordinalSuffix(grade)} grade`;
  } else {
    interpretation = 'College level';
  }

  return { formula: 'SMOG Index', score, grade, interpretation };
}

function ordinalSuffix(n: number): string {
  if (n >= 11 && n <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

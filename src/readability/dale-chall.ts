import { ReadabilityScore } from '../types.js';
import { tokenizeWords, tokenizeSentences } from '../core/tokenizer.js';
import { DALE_CHALL_WORDS } from '../data/dale-chall-words.js';

export function daleChallScore(text: string): ReadabilityScore {
  const words = tokenizeWords(text);
  const sentenceCount = Math.max(1, tokenizeSentences(text).length);
  const wordCount = words.length;

  if (wordCount === 0) {
    return { formula: 'Dale-Chall Readability Score', score: 0, grade: 0, interpretation: 'N/A' };
  }

  let difficultWords = 0;
  for (const word of words) {
    const lower = word.toLowerCase().replace(/[^a-z']/g, '');
    if (lower && !DALE_CHALL_WORDS.has(lower)) {
      difficultWords++;
    }
  }

  const difficultWordPct = (difficultWords / wordCount) * 100;
  let raw = 0.1579 * difficultWordPct + 0.0496 * (wordCount / sentenceCount);
  if (difficultWordPct > 5) {
    raw += 3.6365;
  }

  const score = Math.max(0, Math.round(raw * 10) / 10);

  let grade: number;
  let interpretation: string;
  if (score <= 4.9) {
    grade = 4;
    interpretation = '4th grade or below';
  } else if (score <= 5.9) {
    grade = 6;
    interpretation = '5th-6th grade';
  } else if (score <= 6.9) {
    grade = 8;
    interpretation = '7th-8th grade';
  } else if (score <= 7.9) {
    grade = 10;
    interpretation = '9th-10th grade';
  } else if (score <= 8.9) {
    grade = 12;
    interpretation = '11th-12th grade';
  } else if (score <= 9.9) {
    grade = 15;
    interpretation = '13th-15th grade (College)';
  } else {
    grade = 16;
    interpretation = '16th grade+ (College graduate)';
  }

  return { formula: 'Dale-Chall Readability Score', score, grade, interpretation };
}

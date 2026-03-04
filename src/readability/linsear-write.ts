import { ReadabilityScore } from '../types.js';
import { tokenizeWords, tokenizeSentences } from '../core/tokenizer.js';
import { countSyllables } from '../core/syllables.js';

export function linsearWriteFormula(text: string): ReadabilityScore {
  const allWords = tokenizeWords(text);

  if (allWords.length === 0) {
    return { formula: 'Linsear Write Formula', score: 0, grade: 0, interpretation: 'N/A' };
  }

  // Sample up to 100 words
  const sampleWords = allWords.slice(0, 100);

  // Score each word: ≤2 syllables → 1, ≥3 syllables → 3
  let totalScore = 0;
  for (const word of sampleWords) {
    totalScore += countSyllables(word) >= 3 ? 3 : 1;
  }

  // Count sentences that overlap with the sample
  const sentences = tokenizeSentences(text);
  let wordsSoFar = 0;
  let sentencesInSample = 0;
  for (const sentence of sentences) {
    const sentenceWordCount = tokenizeWords(sentence).length;
    wordsSoFar += sentenceWordCount;
    sentencesInSample++;
    if (wordsSoFar >= sampleWords.length) break;
  }
  sentencesInSample = Math.max(1, sentencesInSample);

  const rawScore = totalScore / sentencesInSample;

  let grade: number;
  if (rawScore > 20) {
    grade = rawScore / 2;
  } else {
    grade = (rawScore - 1) / 2;
  }

  grade = Math.max(0, Math.round(grade * 10) / 10);
  const gradeRounded = Math.round(grade);

  let interpretation: string;
  if (gradeRounded <= 0) {
    interpretation = 'Kindergarten';
  } else if (gradeRounded <= 12) {
    interpretation = `${gradeRounded}${ordinalSuffix(gradeRounded)} grade`;
  } else {
    interpretation = 'College level';
  }

  return { formula: 'Linsear Write Formula', score: grade, grade: gradeRounded, interpretation };
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

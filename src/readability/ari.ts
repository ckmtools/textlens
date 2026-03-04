import { TextStatistics, ReadabilityScore } from '../types.js';

export function automatedReadabilityIndex(stats: TextStatistics): ReadabilityScore {
  if (stats.words === 0 || stats.sentences === 0) {
    return { formula: 'Automated Readability Index', score: 0, grade: 0, interpretation: 'N/A' };
  }

  const raw = 4.71 * stats.avgWordLength + 0.5 * stats.avgSentenceLength - 21.43;

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

  return { formula: 'Automated Readability Index', score, grade, interpretation };
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

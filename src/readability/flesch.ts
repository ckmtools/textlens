import { TextStatistics, ReadabilityScore } from '../types.js';

export function fleschReadingEase(stats: TextStatistics): ReadabilityScore {
  if (stats.words === 0 || stats.sentences === 0) {
    return { formula: 'Flesch Reading Ease', score: 0, grade: 0, interpretation: 'N/A' };
  }

  const score =
    206.835 -
    1.015 * (stats.words / stats.sentences) -
    84.6 * (stats.syllables / stats.words);

  let grade: number;
  let interpretation: string;

  if (score >= 90) {
    grade = 5;
    interpretation = 'Very Easy';
  } else if (score >= 80) {
    grade = 6;
    interpretation = 'Easy';
  } else if (score >= 70) {
    grade = 7;
    interpretation = 'Fairly Easy';
  } else if (score >= 60) {
    grade = 8;
    interpretation = 'Standard';
  } else if (score >= 50) {
    grade = 10;
    interpretation = 'Fairly Difficult';
  } else if (score >= 30) {
    grade = 13;
    interpretation = 'Difficult';
  } else {
    grade = 16;
    interpretation = 'Very Confusing';
  }

  return { formula: 'Flesch Reading Ease', score: Math.round(score * 10) / 10, grade, interpretation };
}

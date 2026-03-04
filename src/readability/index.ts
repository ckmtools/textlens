import { ReadabilityResult } from '../types.js';
import { computeStatistics } from '../core/statistics.js';
import { fleschReadingEase } from './flesch.js';
import { fleschKincaidGrade } from './flesch-kincaid.js';
import { colemanLiauIndex } from './coleman-liau.js';
import { automatedReadabilityIndex } from './ari.js';
import { gunningFogIndex } from './gunning-fog.js';
import { smogIndex } from './smog.js';
import { daleChallScore } from './dale-chall.js';
import { linsearWriteFormula } from './linsear-write.js';

export { fleschReadingEase } from './flesch.js';
export { fleschKincaidGrade } from './flesch-kincaid.js';
export { colemanLiauIndex } from './coleman-liau.js';
export { automatedReadabilityIndex } from './ari.js';
export { gunningFogIndex } from './gunning-fog.js';
export { smogIndex } from './smog.js';
export { daleChallScore } from './dale-chall.js';
export { linsearWriteFormula } from './linsear-write.js';

export function readability(text: string): ReadabilityResult {
  const stats = computeStatistics(text);

  const fre = fleschReadingEase(stats);
  const fkg = fleschKincaidGrade(stats);
  const cli = colemanLiauIndex(stats);
  const ari = automatedReadabilityIndex(stats);
  const gf = gunningFogIndex(text);
  const sm = smogIndex(text);
  const dc = daleChallScore(text);
  const lw = linsearWriteFormula(text);

  // Consensus: average of 7 grade-level formulas (exclude Flesch Reading Ease which is a score, not a grade)
  const grades = [fkg.grade, cli.grade, ari.grade, gf.grade, sm.grade, dc.grade, lw.grade];
  const consensusGrade = Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10) / 10;

  return {
    fleschReadingEase: fre,
    fleschKincaidGrade: fkg,
    colemanLiauIndex: cli,
    automatedReadabilityIndex: ari,
    gunningFogIndex: gf,
    smogIndex: sm,
    daleChallScore: dc,
    linsearWriteFormula: lw,
    consensusGrade,
  };
}

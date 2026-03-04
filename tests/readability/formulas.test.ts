import { describe, it, expect } from 'vitest';
import { computeStatistics } from '../../src/core/statistics.js';
import { fleschReadingEase } from '../../src/readability/flesch.js';
import { fleschKincaidGrade } from '../../src/readability/flesch-kincaid.js';
import { colemanLiauIndex } from '../../src/readability/coleman-liau.js';
import { automatedReadabilityIndex } from '../../src/readability/ari.js';
import { gunningFogIndex } from '../../src/readability/gunning-fog.js';
import { smogIndex } from '../../src/readability/smog.js';
import { daleChallScore } from '../../src/readability/dale-chall.js';
import { linsearWriteFormula } from '../../src/readability/linsear-write.js';
import { readability } from '../../src/readability/index.js';

const SIMPLE_TEXT =
  'The cat sat on the mat. The dog ran in the park. It was a fun day for all.';

const MEDIUM_TEXT =
  'The quick brown fox demonstrated remarkable agility as it jumped over the lazy dog. This particular maneuver required significant coordination and balance. Scientists have studied such movements extensively.';

const COMPLEX_TEXT =
  'The epistemological implications of quantum mechanical phenomena necessitate a fundamental reconceptualization of deterministic frameworks previously considered axiomatic in classical physics. Furthermore, the philosophical ramifications extend beyond mere scientific methodology into broader metaphysical considerations regarding the nature of objective reality.';

const simpleStats = computeStatistics(SIMPLE_TEXT);
const mediumStats = computeStatistics(MEDIUM_TEXT);
const complexStats = computeStatistics(COMPLEX_TEXT);
const emptyStats = computeStatistics('');

describe('fleschReadingEase', () => {
  it('should return higher scores for simpler text', () => {
    const simple = fleschReadingEase(simpleStats);
    const medium = fleschReadingEase(mediumStats);
    const complex = fleschReadingEase(complexStats);

    expect(simple.score).toBeGreaterThan(medium.score);
    expect(medium.score).toBeGreaterThan(complex.score);
  });

  it('should produce scores in a reasonable range', () => {
    const simple = fleschReadingEase(simpleStats);
    const complex = fleschReadingEase(complexStats);

    expect(simple.score).toBeGreaterThan(50);
    expect(complex.score).toBeLessThan(30);
  });

  it('should return score 0 for empty text', () => {
    const result = fleschReadingEase(emptyStats);
    expect(result.score).toBe(0);
    expect(result.grade).toBe(0);
    expect(result.interpretation).toBe('N/A');
  });

  it('should include the formula name', () => {
    const result = fleschReadingEase(simpleStats);
    expect(result.formula).toBe('Flesch Reading Ease');
  });
});

describe('fleschKincaidGrade', () => {
  it('should return lower grade for simpler text', () => {
    const simple = fleschKincaidGrade(simpleStats);
    const medium = fleschKincaidGrade(mediumStats);
    const complex = fleschKincaidGrade(complexStats);

    expect(simple.score).toBeLessThan(medium.score);
    expect(medium.score).toBeLessThan(complex.score);
  });

  it('should produce grades in a reasonable range', () => {
    const simple = fleschKincaidGrade(simpleStats);
    const complex = fleschKincaidGrade(complexStats);

    expect(simple.score).toBeLessThan(8);
    expect(complex.score).toBeGreaterThan(10);
  });

  it('should return score 0 for empty text', () => {
    const result = fleschKincaidGrade(emptyStats);
    expect(result.score).toBe(0);
    expect(result.grade).toBe(0);
    expect(result.interpretation).toBe('N/A');
  });

  it('should include the formula name', () => {
    const result = fleschKincaidGrade(simpleStats);
    expect(result.formula).toBe('Flesch-Kincaid Grade Level');
  });
});

describe('colemanLiauIndex', () => {
  it('should return lower grade for simpler text', () => {
    const simple = colemanLiauIndex(simpleStats);
    const medium = colemanLiauIndex(mediumStats);
    const complex = colemanLiauIndex(complexStats);

    expect(simple.score).toBeLessThan(medium.score);
    expect(medium.score).toBeLessThan(complex.score);
  });

  it('should produce grades in a reasonable range', () => {
    const simple = colemanLiauIndex(simpleStats);
    const complex = colemanLiauIndex(complexStats);

    expect(simple.score).toBeLessThan(10);
    expect(complex.score).toBeGreaterThan(10);
  });

  it('should return score 0 for empty text', () => {
    const result = colemanLiauIndex(emptyStats);
    expect(result.score).toBe(0);
    expect(result.grade).toBe(0);
    expect(result.interpretation).toBe('N/A');
  });

  it('should include the formula name', () => {
    const result = colemanLiauIndex(simpleStats);
    expect(result.formula).toBe('Coleman-Liau Index');
  });
});

describe('automatedReadabilityIndex', () => {
  it('should return lower grade for simpler text', () => {
    const simple = automatedReadabilityIndex(simpleStats);
    const medium = automatedReadabilityIndex(mediumStats);
    const complex = automatedReadabilityIndex(complexStats);

    expect(simple.score).toBeLessThan(medium.score);
    expect(medium.score).toBeLessThan(complex.score);
  });

  it('should produce grades in a reasonable range', () => {
    const simple = automatedReadabilityIndex(simpleStats);
    const complex = automatedReadabilityIndex(complexStats);

    expect(simple.score).toBeLessThan(8);
    expect(complex.score).toBeGreaterThan(10);
  });

  it('should return score 0 for empty text', () => {
    const result = automatedReadabilityIndex(emptyStats);
    expect(result.score).toBe(0);
    expect(result.grade).toBe(0);
    expect(result.interpretation).toBe('N/A');
  });

  it('should include the formula name', () => {
    const result = automatedReadabilityIndex(simpleStats);
    expect(result.formula).toBe('Automated Readability Index');
  });
});

describe('gunningFogIndex', () => {
  it('should return lower grade for simpler text', () => {
    const simple = gunningFogIndex(SIMPLE_TEXT);
    const medium = gunningFogIndex(MEDIUM_TEXT);
    const complex = gunningFogIndex(COMPLEX_TEXT);

    expect(simple.score).toBeLessThan(medium.score);
    expect(medium.score).toBeLessThan(complex.score);
  });

  it('should produce grades in a reasonable range', () => {
    const simple = gunningFogIndex(SIMPLE_TEXT);
    const complex = gunningFogIndex(COMPLEX_TEXT);

    expect(simple.score).toBeLessThan(10);
    expect(complex.score).toBeGreaterThan(10);
  });

  it('should return score 0 for empty text', () => {
    const result = gunningFogIndex('');
    expect(result.score).toBe(0);
    expect(result.grade).toBe(0);
    expect(result.interpretation).toBe('N/A');
  });

  it('should include the formula name', () => {
    const result = gunningFogIndex(SIMPLE_TEXT);
    expect(result.formula).toBe('Gunning Fog Index');
  });
});

describe('smogIndex', () => {
  it('should return lower grade for simpler text', () => {
    const simple = smogIndex(SIMPLE_TEXT);
    const medium = smogIndex(MEDIUM_TEXT);
    const complex = smogIndex(COMPLEX_TEXT);

    expect(simple.score).toBeLessThan(medium.score);
    expect(medium.score).toBeLessThan(complex.score);
  });

  it('should produce grades in a reasonable range', () => {
    const simple = smogIndex(SIMPLE_TEXT);
    const complex = smogIndex(COMPLEX_TEXT);

    expect(simple.score).toBeLessThan(10);
    expect(complex.score).toBeGreaterThan(10);
  });

  it('should return score 0 for empty text', () => {
    const result = smogIndex('');
    expect(result.score).toBe(0);
    expect(result.grade).toBe(0);
    expect(result.interpretation).toBe('N/A');
  });

  it('should include the formula name', () => {
    const result = smogIndex(SIMPLE_TEXT);
    expect(result.formula).toBe('SMOG Index');
  });
});

describe('daleChallScore', () => {
  it('should return lower score for simpler text', () => {
    const simple = daleChallScore(SIMPLE_TEXT);
    const medium = daleChallScore(MEDIUM_TEXT);
    const complex = daleChallScore(COMPLEX_TEXT);

    expect(simple.score).toBeLessThan(medium.score);
    expect(medium.score).toBeLessThan(complex.score);
  });

  it('should produce scores in a reasonable range', () => {
    const simple = daleChallScore(SIMPLE_TEXT);
    const complex = daleChallScore(COMPLEX_TEXT);

    expect(simple.score).toBeLessThan(8);
    expect(complex.score).toBeGreaterThan(8);
  });

  it('should return score 0 for empty text', () => {
    const result = daleChallScore('');
    expect(result.score).toBe(0);
    expect(result.grade).toBe(0);
    expect(result.interpretation).toBe('N/A');
  });

  it('should include the formula name', () => {
    const result = daleChallScore(SIMPLE_TEXT);
    expect(result.formula).toBe('Dale-Chall Readability Score');
  });
});

describe('linsearWriteFormula', () => {
  it('should return lower grade for simpler text', () => {
    const simple = linsearWriteFormula(SIMPLE_TEXT);
    const medium = linsearWriteFormula(MEDIUM_TEXT);
    const complex = linsearWriteFormula(COMPLEX_TEXT);

    expect(simple.score).toBeLessThan(medium.score);
    expect(medium.score).toBeLessThan(complex.score);
  });

  it('should produce grades in a reasonable range', () => {
    const simple = linsearWriteFormula(SIMPLE_TEXT);
    const complex = linsearWriteFormula(COMPLEX_TEXT);

    expect(simple.score).toBeLessThan(10);
    expect(complex.score).toBeGreaterThan(5);
  });

  it('should return score 0 for empty text', () => {
    const result = linsearWriteFormula('');
    expect(result.score).toBe(0);
    expect(result.grade).toBe(0);
    expect(result.interpretation).toBe('N/A');
  });

  it('should include the formula name', () => {
    const result = linsearWriteFormula(SIMPLE_TEXT);
    expect(result.formula).toBe('Linsear Write Formula');
  });
});

describe('readability (consensus)', () => {
  it('should return all 8 scores plus consensusGrade', () => {
    const result = readability(MEDIUM_TEXT);

    expect(result.fleschReadingEase).toBeDefined();
    expect(result.fleschKincaidGrade).toBeDefined();
    expect(result.colemanLiauIndex).toBeDefined();
    expect(result.automatedReadabilityIndex).toBeDefined();
    expect(result.gunningFogIndex).toBeDefined();
    expect(result.smogIndex).toBeDefined();
    expect(result.daleChallScore).toBeDefined();
    expect(result.linsearWriteFormula).toBeDefined();
    expect(typeof result.consensusGrade).toBe('number');
  });

  it('should produce a reasonable consensus grade', () => {
    const result = readability(MEDIUM_TEXT);
    expect(result.consensusGrade).toBeGreaterThan(0);
    expect(result.consensusGrade).toBeLessThan(20);
  });

  it('should have lower consensus grade for simpler text', () => {
    const simple = readability(SIMPLE_TEXT);
    const complex = readability(COMPLEX_TEXT);

    expect(simple.consensusGrade).toBeLessThan(complex.consensusGrade);
  });

  it('should handle empty text', () => {
    const result = readability('');
    expect(result.consensusGrade).toBe(0);
  });
});

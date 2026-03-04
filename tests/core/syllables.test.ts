import { describe, it, expect } from 'vitest';
import { countSyllables, countTotalSyllables } from '../../src/core/syllables.js';

describe('countSyllables', () => {
  it('counts 1-syllable words', () => {
    const words = ['the', 'cat', 'dog', 'run', 'smile', 'strengths'];
    for (const word of words) {
      expect(countSyllables(word), `"${word}" should be 1 syllable`).toBe(1);
    }
  });

  it('counts 2-syllable words', () => {
    const words: [string, number][] = [
      ['hello', 2],
      ['people', 2],
      ['above', 2],
      ['nature', 2],
      ['something', 2],
    ];
    for (const [word, expected] of words) {
      expect(countSyllables(word), `"${word}" should be ${expected} syllables`).toBe(expected);
    }
  });

  it('counts 3-syllable words', () => {
    const words: [string, number][] = [
      ['beautiful', 3],
      ['area', 3],
      ['idea', 3],
      ['important', 3],
      ['different', 3],
    ];
    for (const [word, expected] of words) {
      expect(countSyllables(word), `"${word}" should be ${expected} syllables`).toBe(expected);
    }
  });

  it('counts 4-syllable words', () => {
    const words: [string, number][] = [
      ['information', 4],
      ['experience', 4],
      ['interesting', 4],
      ['temperature', 4],
    ];
    for (const [word, expected] of words) {
      expect(countSyllables(word), `"${word}" should be ${expected} syllables`).toBe(expected);
    }
  });

  it('returns 1 for empty/non-alpha input', () => {
    expect(countSyllables('...')).toBe(1);
  });

  it('returns 0 for empty string', () => {
    expect(countSyllables('')).toBe(0);
  });

  it('handles exception words correctly', () => {
    expect(countSyllables('queue')).toBe(1);
    expect(countSyllables('league')).toBe(1);
    expect(countSyllables('genuine')).toBe(3);
    expect(countSyllables('somewhere')).toBe(2);
    expect(countSyllables('continue')).toBe(3);
  });

  it('handles words with silent-e', () => {
    expect(countSyllables('file')).toBe(1);
    expect(countSyllables('while')).toBe(1);
    expect(countSyllables('come')).toBe(1);
    expect(countSyllables('have')).toBe(1);
  });

  it('handles -ed endings', () => {
    expect(countSyllables('walked')).toBe(1);
    expect(countSyllables('jumped')).toBe(1);
  });
});

describe('countTotalSyllables', () => {
  it('sums syllables correctly', () => {
    const words = ['hello', 'world'];
    // hello = 2, world = 1
    expect(countTotalSyllables(words)).toBe(3);
  });

  it('returns 0 for empty array', () => {
    expect(countTotalSyllables([])).toBe(0);
  });

  it('handles single word', () => {
    expect(countTotalSyllables(['beautiful'])).toBe(3);
  });
});

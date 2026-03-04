import { describe, it, expect } from 'vitest';
import { density } from '../../src/analysis/density';

const SAMPLE = 'The cat sat on the mat. The cat was happy. The mat was red.';

describe('density', () => {
  it('should return unigrams, bigrams, trigrams', () => {
    const result = density(SAMPLE);
    expect(result).toHaveProperty('unigrams');
    expect(result).toHaveProperty('bigrams');
    expect(result).toHaveProperty('trigrams');
  });

  it('should find frequent unigrams', () => {
    const result = density(SAMPLE);
    const words = result.unigrams.map(u => u.text);
    expect(words).toContain('cat');
    expect(words).toContain('mat');
  });

  it('should compute density as percentage', () => {
    const result = density(SAMPLE);
    for (const entry of result.unigrams) {
      expect(entry.density).toBeGreaterThan(0);
      expect(entry.density).toBeLessThanOrEqual(100);
    }
  });

  it('should handle empty text', () => {
    const result = density('');
    expect(result.unigrams).toHaveLength(0);
    expect(result.bigrams).toHaveLength(0);
    expect(result.trigrams).toHaveLength(0);
  });
});

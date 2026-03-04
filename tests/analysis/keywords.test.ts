import { describe, it, expect } from 'vitest';
import { keywords } from '../../src/analysis/keywords';

const SAMPLE = 'TypeScript is a programming language developed by Microsoft. TypeScript adds static typing to JavaScript. Many developers prefer TypeScript for large applications. The TypeScript compiler catches errors at compile time. TypeScript supports modern JavaScript features.';

describe('keywords', () => {
  it('should extract typescript as top keyword', () => {
    const result = keywords(SAMPLE);
    expect(result[0].word).toBe('typescript');
    expect(result[0].count).toBe(5);
  });

  it('should not include stopwords', () => {
    const result = keywords(SAMPLE);
    const words = result.map(k => k.word);
    expect(words).not.toContain('is');
    expect(words).not.toContain('a');
    expect(words).not.toContain('the');
    expect(words).not.toContain('by');
  });

  it('should have correct fields', () => {
    const result = keywords(SAMPLE);
    expect(result[0]).toHaveProperty('word');
    expect(result[0]).toHaveProperty('score');
    expect(result[0]).toHaveProperty('count');
    expect(result[0]).toHaveProperty('density');
  });

  it('should respect topN option', () => {
    const result = keywords(SAMPLE, { topN: 3 });
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('should handle empty text', () => {
    const result = keywords('');
    expect(result).toHaveLength(0);
  });
});

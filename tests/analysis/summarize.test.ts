import { describe, it, expect } from 'vitest';
import { summarize } from '../../src/analysis/summarize';

const ARTICLE = `The quick brown fox jumped over the lazy dog near the riverbank. This was not an unusual occurrence in the forest where many animals lived together peacefully. The fox was known for its agility and speed throughout the woodland community. Many forest creatures would gather to watch the fox perform its impressive leaps. Scientists have studied the remarkable jumping abilities of foxes for decades. Their research has revealed that foxes can jump up to six feet high. The forest ecosystem depends on the balance between predators and prey. Understanding animal behavior helps conservationists protect natural habitats.`;

describe('summarize', () => {
  it('should return requested number of sentences', () => {
    const result = summarize(ARTICLE, { sentences: 3 });
    expect(result.sentences).toHaveLength(3);
  });

  it('should return sentences from original text', () => {
    const result = summarize(ARTICLE, { sentences: 2 });
    for (const s of result.sentences) {
      expect(ARTICLE).toContain(s);
    }
  });

  it('should have a ratio between 0 and 1', () => {
    const result = summarize(ARTICLE, { sentences: 3 });
    expect(result.ratio).toBeGreaterThan(0);
    expect(result.ratio).toBeLessThanOrEqual(1);
  });

  it('should return all sentences if text is short', () => {
    const result = summarize('Hello world. This is a test.', { sentences: 5 });
    expect(result.sentences.length).toBeLessThanOrEqual(2);
  });

  it('should handle empty text', () => {
    const result = summarize('');
    expect(result.sentences).toHaveLength(0);
    expect(result.ratio).toBe(0);
  });
});

import { describe, it, expect } from 'vitest';
import { computeStatistics } from '../../src/core/statistics.js';

describe('computeStatistics', () => {
  it('should compute stats for a known text', () => {
    const stats = computeStatistics('The cat sat on the mat.');
    expect(stats.words).toBe(6);
    expect(stats.sentences).toBe(1);
    expect(stats.paragraphs).toBe(1);
    expect(stats.syllables).toBeGreaterThanOrEqual(6);
  });

  it('should handle multi-sentence text', () => {
    const text = 'Hello world. How are you? I am fine!';
    const stats = computeStatistics(text);
    expect(stats.sentences).toBe(3);
    expect(stats.words).toBe(8);
  });

  it('should handle multi-paragraph text', () => {
    const stats = computeStatistics('First paragraph.\n\nSecond paragraph.');
    expect(stats.paragraphs).toBe(2);
  });

  it('should return all zeros for empty text', () => {
    const stats = computeStatistics('');
    expect(stats.characters).toBe(0);
    expect(stats.charactersNoSpaces).toBe(0);
    expect(stats.words).toBe(0);
    expect(stats.sentences).toBe(0);
    expect(stats.paragraphs).toBe(0);
    expect(stats.syllables).toBe(0);
    expect(stats.avgWordLength).toBe(0);
    expect(stats.avgSentenceLength).toBe(0);
    expect(stats.avgSyllablesPerWord).toBe(0);
  });

  it('should return all zeros for whitespace-only text', () => {
    const stats = computeStatistics('   ');
    expect(stats.characters).toBe(3);
    expect(stats.charactersNoSpaces).toBe(0);
    expect(stats.words).toBe(0);
    expect(stats.sentences).toBe(0);
    expect(stats.paragraphs).toBe(0);
    expect(stats.syllables).toBe(0);
    expect(stats.avgWordLength).toBe(0);
    expect(stats.avgSentenceLength).toBe(0);
    expect(stats.avgSyllablesPerWord).toBe(0);
  });

  it('should handle a single word', () => {
    const stats = computeStatistics('Hello');
    expect(stats.words).toBe(1);
    expect(stats.sentences).toBe(1);
    expect(stats.paragraphs).toBe(1);
  });

  it('should compute averages correctly', () => {
    // "I am ok" — words: ["I", "am", "ok"] (lengths: 1, 2, 2 → avg 5/3)
    // 1 sentence, syllables: I=1, am=1, ok=1 → total 3, avg 1.0
    const stats = computeStatistics('I am ok.');
    expect(stats.words).toBe(3);
    expect(stats.avgWordLength).toBeCloseTo(5 / 3);
    expect(stats.avgSentenceLength).toBe(3);
    expect(stats.avgSyllablesPerWord).toBeCloseTo(1.0);
  });
});

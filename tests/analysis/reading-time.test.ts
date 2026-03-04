import { describe, it, expect } from 'vitest';
import { readingTime } from '../../src/analysis/reading-time';

describe('readingTime', () => {
  it('should estimate reading time for known word count', () => {
    // Create text with roughly 238 words (1 minute at default WPM)
    const words = Array(238).fill('word').join(' ');
    const result = readingTime(words);
    expect(result.minutes).toBe(1);
    expect(result.words).toBe(238);
    expect(result.wpm).toBe(238);
  });

  it('should return 0 for empty text', () => {
    const result = readingTime('');
    expect(result.minutes).toBe(0);
    expect(result.words).toBe(0);
  });

  it('should use custom WPM', () => {
    const words = Array(500).fill('word').join(' ');
    const result = readingTime(words, { wpm: 250 });
    expect(result.wpm).toBe(250);
    expect(result.minutes).toBe(2); // 500/250 = 2 minutes
  });

  it('should add time for images', () => {
    const words = Array(238).fill('word').join(' ');
    const withoutImages = readingTime(words);
    const withImages = readingTime(words, { imageCount: 3 });
    expect(withImages.seconds).toBeGreaterThan(withoutImages.seconds);
  });
});

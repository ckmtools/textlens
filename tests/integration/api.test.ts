import { describe, it, expect } from 'vitest';
import { analyze, statistics, readability, readingTime, keywords, density, sentiment, seoScore, summarize } from '../../src/index';

const SAMPLE_TEXT = `Artificial intelligence has transformed the technology industry in recent years. Machine learning algorithms can now recognize images, understand natural language, and generate creative content. Companies around the world are investing billions of dollars in AI research and development.

Despite the remarkable progress, significant challenges remain. Ensuring AI systems are fair, transparent, and accountable is a major concern for researchers and policymakers. The environmental impact of training large models has also drawn criticism from environmental groups.

Looking ahead, experts predict that AI will continue to reshape industries from healthcare to education. The key question is not whether AI will transform society, but how we can ensure that transformation benefits everyone equally.`;

describe('analyze()', () => {
  it('should return all analysis fields', () => {
    const result = analyze(SAMPLE_TEXT);
    expect(result).toHaveProperty('statistics');
    expect(result).toHaveProperty('readability');
    expect(result).toHaveProperty('readingTime');
    expect(result).toHaveProperty('sentiment');
    expect(result).toHaveProperty('keywords');
    expect(result).toHaveProperty('summary');
  });

  it('should compute reasonable statistics', () => {
    const result = analyze(SAMPLE_TEXT);
    expect(result.statistics.words).toBeGreaterThan(50);
    expect(result.statistics.sentences).toBeGreaterThan(5);
    expect(result.statistics.paragraphs).toBe(3);
  });

  it('should produce readability scores', () => {
    const result = analyze(SAMPLE_TEXT);
    expect(result.readability.consensusGrade).toBeGreaterThan(0);
    expect(result.readability.fleschReadingEase.score).toBeGreaterThan(0);
    expect(result.readability.fleschReadingEase.score).toBeLessThan(100);
  });

  it('should estimate reading time', () => {
    const result = analyze(SAMPLE_TEXT);
    expect(result.readingTime.minutes).toBeGreaterThan(0);
    expect(result.readingTime.words).toBeGreaterThan(0);
  });

  it('should extract keywords', () => {
    const result = analyze(SAMPLE_TEXT);
    expect(result.keywords.length).toBeGreaterThan(0);
    // 'ai' or 'artificial' or 'intelligence' should be a top keyword
    const topWords = result.keywords.map(k => k.word);
    const hasAIKeyword = topWords.some(w => ['ai', 'artificial', 'intelligence', 'learning'].includes(w));
    expect(hasAIKeyword).toBe(true);
  });

  it('should generate a summary', () => {
    const result = analyze(SAMPLE_TEXT);
    expect(result.summary.sentences.length).toBeGreaterThan(0);
    expect(result.summary.sentences.length).toBeLessThanOrEqual(3);
    expect(result.summary.ratio).toBeGreaterThan(0);
    expect(result.summary.ratio).toBeLessThanOrEqual(1);
  });
});

describe('individual functions', () => {
  it('statistics() returns TextStatistics', () => {
    const s = statistics(SAMPLE_TEXT);
    expect(s.words).toBeGreaterThan(0);
    expect(s.avgWordLength).toBeGreaterThan(0);
    expect(s.avgSentenceLength).toBeGreaterThan(0);
  });

  it('readability() returns all 8 formulas', () => {
    const r = readability(SAMPLE_TEXT);
    expect(r.fleschReadingEase).toBeDefined();
    expect(r.fleschKincaidGrade).toBeDefined();
    expect(r.colemanLiauIndex).toBeDefined();
    expect(r.automatedReadabilityIndex).toBeDefined();
    expect(r.gunningFogIndex).toBeDefined();
    expect(r.smogIndex).toBeDefined();
    expect(r.daleChallScore).toBeDefined();
    expect(r.linsearWriteFormula).toBeDefined();
    expect(r.consensusGrade).toBeGreaterThan(0);
  });

  it('sentiment() returns SentimentResult', () => {
    const s = sentiment(SAMPLE_TEXT);
    expect(s.score).toBeGreaterThanOrEqual(-1);
    expect(s.score).toBeLessThanOrEqual(1);
    expect(['positive', 'negative', 'neutral']).toContain(s.label);
  });

  it('seoScore() returns SEOResult', () => {
    const s = seoScore(SAMPLE_TEXT, { targetKeyword: 'ai' });
    expect(s.score).toBeGreaterThanOrEqual(0);
    expect(s.score).toBeLessThanOrEqual(100);
    expect(['A', 'B', 'C', 'D', 'F']).toContain(s.grade);
  });

  it('density() returns n-gram analysis', () => {
    const d = density(SAMPLE_TEXT);
    expect(d.unigrams.length).toBeGreaterThan(0);
    expect(d.bigrams.length).toBeGreaterThan(0);
  });

  it('readingTime() returns ReadingTimeResult', () => {
    const rt = readingTime(SAMPLE_TEXT);
    expect(rt.minutes).toBeGreaterThan(0);
    expect(rt.wpm).toBe(238);
  });

  it('summarize() returns SummaryResult', () => {
    const s = summarize(SAMPLE_TEXT, { sentences: 2 });
    expect(s.sentences).toHaveLength(2);
  });

  it('keywords() respects topN option', () => {
    const k = keywords(SAMPLE_TEXT, { topN: 5 });
    expect(k.length).toBeLessThanOrEqual(5);
  });
});

describe('edge cases', () => {
  describe('empty and minimal input', () => {
    it('handles empty string without throwing', () => {
      const result = analyze('');
      expect(result.statistics.words).toBe(0);
      expect(result.statistics.sentences).toBe(0);
      expect(result.statistics.paragraphs).toBe(0);
      expect(result.statistics.syllables).toBe(0);
      expect(result.statistics.avgWordLength).toBe(0);
      expect(result.statistics.avgSentenceLength).toBe(0);
      expect(result.statistics.avgSyllablesPerWord).toBe(0);
      expect(result.readingTime.minutes).toBe(0);
      expect(result.readability.consensusGrade).toBe(0);
      expect(result.sentiment.label).toBe('neutral');
      expect(result.keywords).toEqual([]);
      expect(result.summary.sentences).toEqual([]);
    });

    it('handles whitespace-only string like empty', () => {
      const result = analyze('   ');
      expect(result.statistics.words).toBe(0);
      expect(result.statistics.avgWordLength).toBe(0);
      expect(Number.isNaN(result.statistics.avgWordLength)).toBe(false);
      expect(Number.isFinite(result.statistics.avgWordLength)).toBe(true);
    });

    it('handles single word without period', () => {
      const result = analyze('Hello');
      expect(result.statistics.words).toBe(1);
      expect(result.statistics.sentences).toBe(1);
      expect(result.readingTime.words).toBe(1);
      expect(Number.isFinite(result.statistics.avgSentenceLength)).toBe(true);
      expect(Number.isFinite(result.statistics.avgSyllablesPerWord)).toBe(true);
    });

    it('handles punctuation only', () => {
      const result = analyze('.');
      expect(result.statistics.words).toBe(0);
      expect(Number.isNaN(result.statistics.avgWordLength)).toBe(false);
    });

    it('no NaN or Infinity in any output field for empty input', () => {
      const result = analyze('');
      const json = JSON.stringify(result);
      expect(json).not.toContain('NaN');
      expect(json).not.toContain('Infinity');
    });

    it('no NaN or Infinity for single word input', () => {
      const result = analyze('Hello');
      const json = JSON.stringify(result);
      expect(json).not.toContain('NaN');
      expect(json).not.toContain('Infinity');
    });
  });

  describe('unicode text', () => {
    it('counts accented words correctly', () => {
      const result = analyze('I visited a café in the naïve résumé district.');
      const words = result.statistics.words;
      expect(words).toBeGreaterThanOrEqual(8);
      const json = JSON.stringify(result);
      expect(json).not.toContain('NaN');
      expect(json).not.toContain('Infinity');
    });

    it('handles emoji without crashing', () => {
      const result = analyze('I love this product 🎉 it is amazing!');
      expect(result.statistics.words).toBeGreaterThan(0);
      expect(result.sentiment.label).toBe('positive');
    });

    it('handles smart quotes like regular quotes', () => {
      const result = analyze('\u201CHello,\u201D she said. \u201CHow are you?\u201D');
      expect(result.statistics.words).toBeGreaterThan(0);
      expect(result.statistics.sentences).toBeGreaterThanOrEqual(1);
    });

    it('treats em-dash as word separator', () => {
      const s = statistics('well\u2014known fact');
      expect(s.words).toBe(3);
    });

    it('treats en-dash as word separator', () => {
      const s = statistics('pages 10\u201320');
      expect(s.words).toBe(3);
    });

    it('handles non-Latin script without crashing', () => {
      const result = analyze('こんにちは世界');
      const json = JSON.stringify(result);
      expect(json).not.toContain('NaN');
      expect(json).not.toContain('Infinity');
    });
  });

  describe('malformed text', () => {
    it('handles text with no sentence-ending punctuation', () => {
      const result = analyze('Hello world this is a test');
      expect(result.statistics.sentences).toBe(1);
      expect(result.statistics.words).toBe(6);
    });

    it('handles text with only numbers', () => {
      const result = analyze('123 456 789');
      expect(result.statistics.words).toBe(3);
      const json = JSON.stringify(result);
      expect(json).not.toContain('NaN');
      expect(json).not.toContain('Infinity');
    });

    it('handles excessive whitespace', () => {
      const result = analyze('hello    world\n\n\n\nparagraph');
      expect(result.statistics.words).toBe(3);
      expect(result.statistics.paragraphs).toBe(2);
    });

    it('handles HTML entities without crashing', () => {
      const result = analyze('Hello &amp; world &lt;b&gt;bold&lt;/b&gt;');
      expect(result.statistics.words).toBeGreaterThan(0);
      const json = JSON.stringify(result);
      expect(json).not.toContain('NaN');
    });
  });

  describe('long text performance', () => {
    it('handles 10,000+ word text without issues', () => {
      const sentence = 'The quick brown fox jumps over the lazy dog. ';
      const longText = sentence.repeat(1200); // ~10,800 words
      const result = analyze(longText);
      expect(result.statistics.words).toBeGreaterThan(10000);
      expect(Number.isFinite(result.readability.consensusGrade)).toBe(true);
      expect(result.summary.sentences.length).toBeGreaterThan(0);
      const json = JSON.stringify(result);
      expect(json).not.toContain('NaN');
      expect(json).not.toContain('Infinity');
    });
  });

  describe('all functions handle empty text', () => {
    it('statistics returns zeroed results', () => {
      const s = statistics('');
      expect(s.words).toBe(0);
      expect(s.avgWordLength).toBe(0);
    });

    it('readability returns grade 0', () => {
      const r = readability('');
      expect(r.consensusGrade).toBe(0);
      expect(r.fleschReadingEase.grade).toBe(0);
    });

    it('readingTime returns 0', () => {
      const rt = readingTime('');
      expect(rt.minutes).toBe(0);
      expect(rt.seconds).toBe(0);
    });

    it('keywords returns empty array', () => {
      const k = keywords('');
      expect(k).toEqual([]);
    });

    it('density returns empty arrays', () => {
      const d = density('');
      expect(d.unigrams).toEqual([]);
      expect(d.bigrams).toEqual([]);
      expect(d.trigrams).toEqual([]);
    });

    it('sentiment returns neutral', () => {
      const s = sentiment('');
      expect(s.label).toBe('neutral');
      expect(s.score).toBe(0);
    });

    it('seoScore returns 0 for empty text', () => {
      const s = seoScore('');
      expect(s.score).toBe(0);
      expect(s.grade).toBe('F');
    });

    it('summarize returns empty for empty text', () => {
      const s = summarize('');
      expect(s.sentences).toEqual([]);
      expect(s.ratio).toBe(0);
    });
  });

  describe('single word input across functions', () => {
    it('density handles single word', () => {
      const d = density('hello');
      expect(d.bigrams).toEqual([]);
      expect(d.trigrams).toEqual([]);
      const json = JSON.stringify(d);
      expect(json).not.toContain('NaN');
    });

    it('summarize handles single short sentence', () => {
      const s = summarize('Hello world.');
      expect(s.sentences.length).toBeGreaterThanOrEqual(0);
    });

    it('seoScore handles single word', () => {
      const s = seoScore('hello');
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(s.score)).toBe(true);
    });
  });
});

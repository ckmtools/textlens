import { describe, it, expect } from 'vitest';
import { seoScore } from '../../src/analysis/seo';

const ARTICLE = `Search engine optimization is the process of improving the quality and quantity of website traffic to a website or a web page from search engines. SEO targets unpaid traffic rather than direct traffic or paid traffic. Unpaid traffic may originate from different kinds of searches, including image search, video search, academic search, news search, and industry-specific vertical search engines.

As an Internet marketing strategy, SEO considers how search engines work, the computer-programmed algorithms that dictate search engine behavior, what people search for, the actual search terms or keywords typed into search engines, and which search engines are preferred by their targeted audience. SEO is performed because a website will receive more visitors from a search engine when websites rank higher on the search engine results page.

These visitors can then potentially be converted into customers. SEO differs from local search engine optimization in that the latter is focused on optimizing a business online presence so that its web pages will be displayed by search engines when a user enters a local search for its products or services.`;

describe('seoScore', () => {
  it('should return a score between 0 and 100', () => {
    const result = seoScore(ARTICLE);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('should return a grade A-F', () => {
    const result = seoScore(ARTICLE);
    expect(['A', 'B', 'C', 'D', 'F']).toContain(result.grade);
  });

  it('should score with target keyword', () => {
    const result = seoScore(ARTICLE, { targetKeyword: 'seo' });
    expect(result.score).toBeGreaterThan(0);
    expect(result.details.keywordScore).toBeGreaterThan(0);
  });

  it('should handle empty text', () => {
    const result = seoScore('');
    expect(result.score).toBe(0);
    expect(result.grade).toBe('F');
  });
});

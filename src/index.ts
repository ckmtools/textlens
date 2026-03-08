import { computeStatistics } from './core/index.js';
import { readability } from './readability/index.js';
import { readingTime } from './analysis/reading-time.js';
import { keywords } from './analysis/keywords.js';
import { density } from './analysis/density.js';
import { sentiment } from './analysis/sentiment.js';
import { seoScore } from './analysis/seo.js';
import { summarize } from './analysis/summarize.js';
import type { AnalysisResult } from './types.js';

// Types
export type {
  TextStatistics,
  ReadabilityScore,
  ReadabilityResult,
  ReadingTimeResult,
  ReadingTimeOptions,
  Keyword,
  KeywordOptions,
  DensityEntry,
  KeywordDensityResult,
  SentimentResult,
  SEOOptions,
  SEOResult,
  SummaryOptions,
  SummaryResult,
  AnalysisResult,
} from './types.js';

// All-in-one analysis
export function analyze(text: string): AnalysisResult {
  if (typeof text !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof text}`);
  }
  return {
    statistics: computeStatistics(text),
    readability: readability(text),
    readingTime: readingTime(text),
    sentiment: sentiment(text),
    keywords: keywords(text),
    summary: summarize(text),
  };
}

// Individual features
const statistics = computeStatistics;
export { statistics, readability, readingTime, keywords, density, sentiment, seoScore, summarize };

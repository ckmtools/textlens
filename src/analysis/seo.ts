import { SEOResult, SEOOptions } from '../types';
import { computeStatistics } from '../core';
import { readability } from '../readability';
import { keywords } from './keywords';
import { density } from './density';
import { tokenizeSentences, tokenizeWords } from '../core';

export function seoScore(text: string, options?: SEOOptions): SEOResult {
  const targetGrade = options?.targetGrade ?? 7;
  const targetKeyword = options?.targetKeyword;

  const issues: string[] = [];
  const suggestions: string[] = [];

  const stats = computeStatistics(text);

  if (stats.words === 0) {
    return {
      score: 0,
      grade: 'F',
      issues: ['Content is empty'],
      suggestions: ['Add content to analyze'],
      details: {
        readabilityScore: 0,
        contentLengthScore: 0,
        keywordScore: 0,
        sentenceVarietyScore: 0,
      },
    };
  }

  // 1. Readability Score (0-25)
  const readResult = readability(text);
  const consensus = readResult.consensusGrade;
  let readabilityScore: number;
  const diff = Math.abs(consensus - targetGrade);
  if (diff <= 2) {
    readabilityScore = 25;
  } else {
    readabilityScore = Math.max(0, 25 - (diff - 2) * 3);
  }
  if (consensus > 12) {
    issues.push('Content reading level is too advanced for general audience');
  }
  if (consensus < 4) {
    issues.push('Content may be too simplistic');
  }
  if (consensus > targetGrade + 2) {
    suggestions.push(`Simplify language to target grade ${targetGrade} reading level`);
  }

  // 2. Content Length Score (0-25)
  const wordCount = stats.words;
  let contentLengthScore: number;
  if (wordCount < 300) {
    contentLengthScore = (wordCount / 300) * 25;
  } else if (wordCount <= 2500) {
    contentLengthScore = 25;
  } else if (wordCount <= 5000) {
    contentLengthScore = 20;
  } else {
    contentLengthScore = 15;
  }
  if (wordCount < 300) {
    issues.push('Content is too short for good SEO performance');
    suggestions.push('Aim for at least 300 words of content');
  }
  if (wordCount > 5000) {
    suggestions.push('Consider breaking into multiple pages');
  }

  // 3. Keyword Score (0-25)
  let keywordScore: number;
  if (targetKeyword) {
    const densityResult = density(text);
    const targetLower = targetKeyword.toLowerCase();
    const entry = densityResult.unigrams.find(u => u.text === targetLower);
    const kwDensity = entry ? entry.density : 0;

    if (kwDensity < 0.5) {
      keywordScore = Math.max(0, (kwDensity / 0.5) * 10);
      suggestions.push(`Use the keyword "${targetKeyword}" more frequently`);
    } else if (kwDensity < 1) {
      keywordScore = 15;
    } else if (kwDensity <= 3) {
      keywordScore = 25;
    } else if (kwDensity <= 5) {
      keywordScore = 15;
      suggestions.push('Reduce keyword usage slightly to avoid keyword stuffing');
    } else {
      keywordScore = 5;
      issues.push('Keyword stuffing detected');
    }
  } else {
    const topKw = keywords(text, { topN: 5 });
    if (topKw.length > 0 && topKw[0].density > 5) {
      keywordScore = 10;
    } else {
      keywordScore = 20;
    }
    suggestions.push('Provide a target keyword for more specific SEO analysis');
  }

  // 4. Sentence Variety Score (0-25)
  const sentences = tokenizeSentences(text);
  const sentenceLengths = sentences.map(s => tokenizeWords(s).length);
  let sentenceVarietyScore: number;

  if (sentenceLengths.length <= 1) {
    sentenceVarietyScore = 10;
  } else {
    const mean = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((sum, len) => sum + (len - mean) ** 2, 0) / sentenceLengths.length;
    const stddev = Math.sqrt(variance);

    if (stddev > 3) {
      sentenceVarietyScore = 25;
    } else if (stddev >= 1.5) {
      sentenceVarietyScore = 18;
    } else {
      sentenceVarietyScore = 10;
      issues.push('Sentences are too uniform in length');
      suggestions.push('Vary sentence length for better readability');
    }
  }

  // Composite Score & Grade
  const score = Math.round(readabilityScore + contentLengthScore + keywordScore + sentenceVarietyScore);
  let grade: string;
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';

  return {
    score,
    grade,
    issues,
    suggestions,
    details: {
      readabilityScore: Math.round(readabilityScore * 10) / 10,
      contentLengthScore: Math.round(contentLengthScore * 10) / 10,
      keywordScore: Math.round(keywordScore * 10) / 10,
      sentenceVarietyScore: Math.round(sentenceVarietyScore * 10) / 10,
    },
  };
}

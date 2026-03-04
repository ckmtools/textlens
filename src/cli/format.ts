import type { AnalysisResult, ReadabilityResult, ReadabilityScore, SentimentResult, Keyword, KeywordDensityResult, SEOResult, SummaryResult } from '../types.js';
import type { ParsedArgs } from './args.js';

const WIDTH = 42;

function pad(str: string, len: number): string {
  if (str.length >= len) return str.slice(0, len);
  return str + ' '.repeat(len - str.length);
}

function topBar(): string {
  return '\u2554' + '\u2550'.repeat(WIDTH) + '\u2557';
}

function bottomBar(): string {
  return '\u255a' + '\u2550'.repeat(WIDTH) + '\u255d';
}

function divider(): string {
  return '\u2560' + '\u2550'.repeat(WIDTH) + '\u2563';
}

function centerLine(text: string): string {
  const inner = WIDTH;
  const padding = Math.max(0, inner - text.length);
  const left = Math.floor(padding / 2);
  const right = padding - left;
  return '\u2551' + ' '.repeat(left) + text + ' '.repeat(right) + '\u2551';
}

function kvLine(key: string, value: string): string {
  const sep = ' \u2502 ';
  const keyWidth = 18;
  const valWidth = WIDTH - keyWidth - sep.length - 2; // 2 for padding
  const paddedKey = pad(key, keyWidth);
  const paddedVal = pad(value, valWidth);
  return '\u2551 ' + paddedKey + sep + paddedVal + '\u2551';
}

function wrapLine(text: string): string {
  const inner = WIDTH - 2;
  if (text.length <= inner) {
    return '\u2551 ' + pad(text, inner) + '\u2551';
  }
  const lines: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    const chunk = remaining.slice(0, inner);
    lines.push('\u2551 ' + pad(chunk, inner) + '\u2551');
    remaining = remaining.slice(inner);
  }
  return lines.join('\n');
}

function fleschLabel(score: number): string {
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Confusing';
}

function sentimentLabel(score: number): string {
  if (score > 0.05) return 'Positive';
  if (score < -0.05) return 'Negative';
  return 'Neutral';
}

function formatReadabilitySection(r: ReadabilityResult): string[] {
  const lines: string[] = [];
  lines.push(divider());
  lines.push(centerLine('READABILITY SCORES'));
  lines.push(divider());

  const fe = r.fleschReadingEase;
  lines.push(kvLine('Flesch Ease', `${fe.score.toFixed(1)} (${fleschLabel(fe.score)})`));
  lines.push(kvLine('Flesch-Kincaid', `Grade ${r.fleschKincaidGrade.grade.toFixed(1)}`));
  lines.push(kvLine('Coleman-Liau', `Grade ${r.colemanLiauIndex.grade.toFixed(1)}`));
  lines.push(kvLine('ARI', `Grade ${r.automatedReadabilityIndex.grade.toFixed(1)}`));
  lines.push(kvLine('Gunning Fog', `Grade ${r.gunningFogIndex.grade.toFixed(1)}`));
  lines.push(kvLine('SMOG', `Grade ${r.smogIndex.grade.toFixed(1)}`));
  lines.push(kvLine('Dale-Chall', `Grade ${r.daleChallScore.grade.toFixed(1)}`));
  lines.push(kvLine('Linsear Write', `Grade ${r.linsearWriteFormula.grade.toFixed(1)}`));
  lines.push(kvLine('Consensus', `Grade ${r.consensusGrade.toFixed(1)}`));

  return lines;
}

function formatSentimentSection(s: SentimentResult): string[] {
  const lines: string[] = [];
  lines.push(divider());
  lines.push(centerLine('SENTIMENT'));
  lines.push(divider());
  lines.push(kvLine('Score', `${s.comparative.toFixed(2)} (${sentimentLabel(s.comparative)})`));
  lines.push(kvLine('Confidence', s.confidence.toFixed(2)));
  if (s.positive.length > 0) {
    lines.push(kvLine('Positive words', s.positive.slice(0, 5).join(', ')));
  }
  if (s.negative.length > 0) {
    lines.push(kvLine('Negative words', s.negative.slice(0, 5).join(', ')));
  }
  return lines;
}

function formatKeywordsSection(kw: Keyword[], n: number): string[] {
  const lines: string[] = [];
  lines.push(divider());
  lines.push(centerLine('TOP KEYWORDS'));
  lines.push(divider());
  const shown = kw.slice(0, n);
  for (let i = 0; i < shown.length; i++) {
    const k = shown[i];
    const num = pad(`${i + 1}.`, 4);
    const word = pad(k.word, 14);
    const info = `${k.count} (${k.density.toFixed(1)}%)`;
    const inner = WIDTH - 2;
    const line = num + word + info;
    lines.push('\u2551 ' + pad(line, inner) + '\u2551');
  }
  return lines;
}

function formatDensitySection(d: KeywordDensityResult): string[] {
  const lines: string[] = [];
  lines.push(divider());
  lines.push(centerLine('KEYWORD DENSITY'));
  lines.push(divider());

  const sections: [string, typeof d.unigrams][] = [
    ['Unigrams', d.unigrams],
    ['Bigrams', d.bigrams],
    ['Trigrams', d.trigrams],
  ];

  for (const [label, entries] of sections) {
    lines.push(wrapLine(label + ':'));
    for (const e of entries.slice(0, 5)) {
      lines.push(kvLine(`  ${e.text}`, `${e.count} (${e.density.toFixed(1)}%)`));
    }
  }

  return lines;
}

function formatSeoSection(seo: SEOResult): string[] {
  const lines: string[] = [];
  lines.push(divider());
  lines.push(centerLine('SEO ANALYSIS'));
  lines.push(divider());
  lines.push(kvLine('Score', `${seo.score}/100 (${seo.grade})`));
  if (seo.issues.length > 0) {
    lines.push(wrapLine('Issues:'));
    for (const issue of seo.issues.slice(0, 3)) {
      lines.push(wrapLine('  - ' + issue));
    }
  }
  if (seo.suggestions.length > 0) {
    lines.push(wrapLine('Suggestions:'));
    for (const s of seo.suggestions.slice(0, 3)) {
      lines.push(wrapLine('  - ' + s));
    }
  }
  return lines;
}

function formatSummarySection(summary: SummaryResult): string[] {
  const lines: string[] = [];
  lines.push(divider());
  lines.push(centerLine('SUMMARY'));
  lines.push(divider());
  for (const s of summary.sentences) {
    lines.push(wrapLine(s));
  }
  return lines;
}

export function formatPretty(result: any, args: ParsedArgs): string {
  const r = result as AnalysisResult & {
    seo?: SEOResult;
    density?: KeywordDensityResult;
  };
  const lines: string[] = [];

  // Header
  lines.push(topBar());
  lines.push(centerLine('TEXTLENS REPORT'));
  lines.push(divider());

  // Basic stats
  const stats = r.statistics;
  const rt = r.readingTime;
  lines.push(kvLine('Reading Time', `${rt.minutes} min`));
  lines.push(kvLine('Words', String(stats.words)));
  lines.push(kvLine('Sentences', String(stats.sentences)));
  lines.push(kvLine('Paragraphs', String(stats.paragraphs)));
  lines.push(kvLine('Avg Word Length', `${stats.avgWordLength.toFixed(1)} chars`));
  lines.push(kvLine('Avg Sentence Len', `${stats.avgSentenceLength.toFixed(1)} words`));

  // Readability (always shown)
  lines.push(...formatReadabilitySection(r.readability));

  // Optional sections
  const showAll = args.showAll;

  if (showAll || args.showSentiment) {
    lines.push(...formatSentimentSection(r.sentiment));
  }

  if (showAll || args.showKeywords) {
    lines.push(...formatKeywordsSection(r.keywords, args.keywordsN));
  }

  if (showAll || args.showDensity) {
    if (r.density) {
      lines.push(...formatDensitySection(r.density));
    }
  }

  if (showAll || args.showSeo) {
    if (r.seo) {
      lines.push(...formatSeoSection(r.seo));
    }
  }

  if (showAll || args.showSummary) {
    lines.push(...formatSummarySection(r.summary));
  }

  lines.push(bottomBar());
  return lines.join('\n');
}

export function formatJson(result: any): string {
  return JSON.stringify(result, null, 2);
}

export function formatMinimal(result: AnalysisResult): string {
  const grade = result.readability.consensusGrade.toFixed(1);
  const words = result.statistics.words;
  const mins = result.readingTime.minutes;
  const sent = sentimentLabel(result.sentiment.comparative);
  return `Grade ${grade} | ${words} words | ${mins} min read | ${sent} sentiment`;
}

export interface TextStatistics {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  syllables: number;
  avgWordLength: number;
  avgSentenceLength: number;
  avgSyllablesPerWord: number;
}

export interface ReadabilityScore {
  formula: string;
  score: number;
  grade: number;
  interpretation: string;
}

export interface ReadabilityResult {
  fleschReadingEase: ReadabilityScore;
  fleschKincaidGrade: ReadabilityScore;
  colemanLiauIndex: ReadabilityScore;
  automatedReadabilityIndex: ReadabilityScore;
  gunningFogIndex: ReadabilityScore;
  smogIndex: ReadabilityScore;
  daleChallScore: ReadabilityScore;
  linsearWriteFormula: ReadabilityScore;
  consensusGrade: number;
}

export interface ReadingTimeResult {
  minutes: number;
  seconds: number;
  words: number;
  wpm: number;
}

export interface ReadingTimeOptions {
  wpm?: number;
  imageCount?: number;
}

export interface Keyword {
  word: string;
  score: number;
  count: number;
  density: number;
}

export interface KeywordOptions {
  topN?: number;
  minLength?: number;
}

export interface DensityEntry {
  text: string;
  count: number;
  density: number;
}

export interface KeywordDensityResult {
  unigrams: DensityEntry[];
  bigrams: DensityEntry[];
  trigrams: DensityEntry[];
}

export interface SentimentResult {
  score: number;
  comparative: number;
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
  positive: string[];
  negative: string[];
}

export interface SEOOptions {
  targetKeyword?: string;
  targetGrade?: number;
}

export interface SEOResult {
  score: number;
  grade: string;
  issues: string[];
  suggestions: string[];
  details: {
    readabilityScore: number;
    contentLengthScore: number;
    keywordScore: number;
    sentenceVarietyScore: number;
  };
}

export interface SummaryOptions {
  sentences?: number;
}

export interface SummaryResult {
  sentences: string[];
  ratio: number;
}

export interface AnalysisResult {
  statistics: TextStatistics;
  readability: ReadabilityResult;
  readingTime: ReadingTimeResult;
  sentiment: SentimentResult;
  keywords: Keyword[];
  summary: SummaryResult;
}

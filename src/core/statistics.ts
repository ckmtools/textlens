import { TextStatistics } from '../types.js';
import { tokenizeWords, tokenizeSentences, tokenizeParagraphs } from './tokenizer.js';
import { countTotalSyllables } from './syllables.js';

/**
 * Compute text statistics for a given string.
 */
export function computeStatistics(text: string): TextStatistics {
  const words = tokenizeWords(text);
  const wordCount = words.length;

  if (wordCount === 0) {
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      syllables: 0,
      avgWordLength: 0,
      avgSentenceLength: 0,
      avgSyllablesPerWord: 0,
    };
  }

  const sentenceCount = Math.max(1, tokenizeSentences(text).length);
  const paragraphCount = Math.max(1, tokenizeParagraphs(text).length);
  const syllables = countTotalSyllables(words);
  const totalWordChars = words.reduce((sum, w) => sum + w.length, 0);

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: wordCount,
    sentences: sentenceCount,
    paragraphs: paragraphCount,
    syllables,
    avgWordLength: totalWordChars / wordCount,
    avgSentenceLength: wordCount / sentenceCount,
    avgSyllablesPerWord: syllables / wordCount,
  };
}

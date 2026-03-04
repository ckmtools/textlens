import { describe, it, expect } from 'vitest';
import { tokenizeWords, tokenizeSentences, tokenizeParagraphs } from '../../src/core/tokenizer.js';

describe('tokenizeWords', () => {
  it('splits basic words', () => {
    expect(tokenizeWords('Hello world')).toEqual(['Hello', 'world']);
  });

  it('keeps contractions as single tokens', () => {
    expect(tokenizeWords("I don't know")).toEqual(["I", "don't", "know"]);
    expect(tokenizeWords("I'm happy")).toEqual(["I'm", "happy"]);
  });

  it('keeps hyphenated words as single tokens', () => {
    expect(tokenizeWords('well-known fact')).toEqual(['well-known', 'fact']);
  });

  it('strips leading and trailing punctuation', () => {
    expect(tokenizeWords('Hello, world!')).toEqual(['Hello', 'world']);
  });

  it('handles numbers', () => {
    expect(tokenizeWords('He is 25 years old')).toEqual(['He', 'is', '25', 'years', 'old']);
  });

  it('handles decimal numbers', () => {
    const result = tokenizeWords('Pi is 3.14 approximately');
    expect(result).toContain('3.14');
  });

  it('returns empty array for empty string', () => {
    expect(tokenizeWords('')).toEqual([]);
  });

  it('returns empty array for whitespace only', () => {
    expect(tokenizeWords('   ')).toEqual([]);
  });

  it('handles multiple spaces between words', () => {
    expect(tokenizeWords('hello    world')).toEqual(['hello', 'world']);
  });

  it('handles URLs as single tokens', () => {
    const result = tokenizeWords('Visit https://example.com today');
    expect(result).toContain('https://example.com');
    expect(result.length).toBe(3);
  });

  it('handles email addresses as single tokens', () => {
    const result = tokenizeWords('Email me at test@example.com please');
    expect(result).toContain('test@example.com');
  });

  it('filters out pure punctuation', () => {
    const result = tokenizeWords('Hello -- world');
    expect(result).toEqual(['Hello', 'world']);
  });
});

describe('tokenizeSentences', () => {
  it('splits basic sentences', () => {
    expect(tokenizeSentences('Hello. World.')).toEqual(['Hello.', 'World.']);
  });

  it('does not split on abbreviations', () => {
    const result = tokenizeSentences('Mr. Smith went home. He was tired.');
    expect(result.length).toBe(2);
    expect(result[0]).toContain('Mr. Smith');
  });

  it('handles question and exclamation marks', () => {
    const result = tokenizeSentences('What? Yes! OK.');
    expect(result.length).toBe(3);
  });

  it('handles ellipsis as sentence boundary', () => {
    const result = tokenizeSentences('Wait... OK.');
    expect(result.length).toBe(2);
  });

  it('does not split on decimal numbers', () => {
    const result = tokenizeSentences('It cost $3.50 per unit.');
    expect(result.length).toBe(1);
  });

  it('handles multiple punctuation as one boundary', () => {
    const result = tokenizeSentences('Really?! Yes.');
    expect(result.length).toBe(2);
  });

  it('returns empty array for empty string', () => {
    expect(tokenizeSentences('')).toEqual([]);
  });

  it('handles text without sentence-ending punctuation', () => {
    const result = tokenizeSentences('Hello world');
    expect(result).toEqual(['Hello world']);
  });

  it('does not split on initials like U.S.A.', () => {
    const result = tokenizeSentences('The U.S.A. is large. It has many states.');
    expect(result.length).toBe(2);
  });

  it('does not split on e.g. and i.e.', () => {
    const result = tokenizeSentences('Use tools, e.g. a hammer. They help.');
    expect(result.length).toBe(2);
  });

  it('handles Dr. abbreviation', () => {
    const result = tokenizeSentences('Dr. Jones is here. She is a doctor.');
    expect(result.length).toBe(2);
  });
});

describe('tokenizeParagraphs', () => {
  it('splits on double newlines', () => {
    expect(tokenizeParagraphs('Para1.\n\nPara2.')).toEqual(['Para1.', 'Para2.']);
  });

  it('keeps single newline as same paragraph', () => {
    expect(tokenizeParagraphs('Line1.\nLine2.')).toEqual(['Line1.\nLine2.']);
  });

  it('handles Windows-style line endings', () => {
    expect(tokenizeParagraphs('Para1.\r\n\r\nPara2.')).toEqual(['Para1.', 'Para2.']);
  });

  it('returns empty array for empty string', () => {
    expect(tokenizeParagraphs('')).toEqual([]);
  });

  it('trims whitespace from paragraphs', () => {
    expect(tokenizeParagraphs('  Para1.  \n\n  Para2.  ')).toEqual(['Para1.', 'Para2.']);
  });

  it('filters empty paragraphs', () => {
    expect(tokenizeParagraphs('Para1.\n\n\n\nPara2.')).toEqual(['Para1.', 'Para2.']);
  });
});

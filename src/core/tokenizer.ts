const ABBREVIATIONS = new Set([
  'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'st', 'ave', 'blvd',
  'gen', 'gov', 'sgt', 'cpl', 'pvt', 'capt', 'lt', 'col', 'maj',
  'inc', 'ltd', 'corp', 'co', 'dept', 'div', 'est', 'approx',
  'vs', 'fig', 'eq', 'vol', 'no', 'al', 'ed', 'trans', 'rev',
]);

// Matches URLs like http://..., https://..., www....
const URL_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+/gi;

// Matches email addresses
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

/**
 * Split text into word tokens.
 */
export function tokenizeWords(text: string): string[] {
  if (!text || !text.trim()) return [];

  // Extract URLs and emails first, replacing with placeholders
  const preserved: string[] = [];
  let processed = text;

  // Preserve URLs
  processed = processed.replace(URL_REGEX, (match) => {
    preserved.push(match);
    return `__PRESERVED_${preserved.length - 1}__`;
  });

  // Preserve emails
  processed = processed.replace(EMAIL_REGEX, (match) => {
    preserved.push(match);
    return `__PRESERVED_${preserved.length - 1}__`;
  });

  // Normalize smart quotes to regular quotes
  processed = processed.replace(/[\u2018\u2019]/g, "'");
  processed = processed.replace(/[\u201C\u201D]/g, '"');

  // Treat em-dash and en-dash as word separators
  processed = processed.replace(/[\u2013\u2014]/g, ' ');

  // Split on whitespace
  const rawTokens = processed.split(/\s+/);

  const tokens: string[] = [];

  for (const raw of rawTokens) {
    if (!raw) continue;

    // Check for placeholder
    const placeholderMatch = raw.match(/^[^a-zA-Z0-9]*(__PRESERVED_(\d+)__)[^a-zA-Z0-9]*$/);
    if (placeholderMatch) {
      const idx = parseInt(placeholderMatch[2], 10);
      tokens.push(preserved[idx]);
      continue;
    }

    // Strip leading punctuation (but not digits, letters, or underscores for placeholders)
    // Keep internal apostrophes, hyphens, and periods (for decimals)
    let token = raw;

    // Strip leading punctuation (unicode-aware)
    token = token.replace(/^[^\p{L}\p{N}_'-]+/u, '');
    // Strip trailing punctuation (unicode-aware)
    token = token.replace(/[^\p{L}\p{N}_'-]+$/u, '');

    // Handle decimal numbers: if token contains digits and a period between digits, keep it
    if (/^\d+\.\d+$/.test(raw.replace(/^[^\d]+/, '').replace(/[^\d.]+$/, ''))) {
      // Re-extract just the number
      const numMatch = raw.match(/\d+\.\d+/);
      if (numMatch) {
        token = numMatch[0];
      }
    }

    if (!token) continue;

    // Filter pure punctuation tokens (unicode-aware)
    if (/^[^\p{L}\p{N}_]+$/u.test(token)) continue;

    tokens.push(token);
  }

  return tokens;
}

/**
 * Check if a word before a period is an abbreviation.
 */
function isAbbreviation(word: string): boolean {
  const lower = word.toLowerCase().replace(/\.$/, '');
  // Single letter (initial)
  if (lower.length === 1 && /[a-z]/i.test(lower)) return true;
  // Known abbreviation
  if (ABBREVIATIONS.has(lower)) return true;
  return false;
}

/**
 * Check if text at position is a decimal number context.
 */
function isDecimalNumber(text: string, dotIndex: number): boolean {
  if (dotIndex <= 0 || dotIndex >= text.length - 1) return false;
  const before = text[dotIndex - 1];
  const after = text[dotIndex + 1];
  return /\d/.test(before) && /\d/.test(after);
}

/**
 * Check if text at position is part of an abbreviation pattern like "U.S.A." or "e.g."
 */
function isInitialPattern(text: string, dotIndex: number): boolean {
  // Check for patterns like "U.S." or "e.g." — letter.letter
  if (dotIndex >= 1 && dotIndex < text.length - 1) {
    const before = text[dotIndex - 1];
    const after = text[dotIndex + 1];
    if (/[a-zA-Z]/.test(before) && /[a-zA-Z]/.test(after)) {
      // Check it's a single letter before the dot
      if (dotIndex < 2 || !/[a-zA-Z]/.test(text[dotIndex - 2])) {
        return true;
      }
    }
  }
  // Check for ending pattern like "U.S.A." — letter. at end or before space
  if (dotIndex >= 2) {
    const twoBack = text[dotIndex - 2];
    const oneBack = text[dotIndex - 1];
    if (twoBack === '.' && /[a-zA-Z]/.test(oneBack)) {
      return true;
    }
  }
  return false;
}

/**
 * Split text into sentences.
 */
export function tokenizeSentences(text: string): string[] {
  if (!text || !text.trim()) return [];

  const sentences: string[] = [];
  let current = '';
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    // Handle ellipsis
    if (ch === '.' && i + 1 < text.length && text[i + 1] === '.' ) {
      // Consume all dots in the ellipsis
      current += ch;
      i++;
      while (i < text.length && text[i] === '.') {
        current += text[i];
        i++;
      }
      // Treat ellipsis as sentence boundary if followed by whitespace or end
      if (i >= text.length || /\s/.test(text[i])) {
        const trimmed = current.trim();
        if (trimmed) sentences.push(trimmed);
        current = '';
      }
      continue;
    }

    if (ch === '.' || ch === '!' || ch === '?') {
      current += ch;

      // For '.', check if it's an abbreviation, decimal, or initial pattern
      if (ch === '.') {
        // Decimal number check
        if (isDecimalNumber(text, i)) {
          i++;
          continue;
        }

        // Initial/acronym pattern check (e.g., U.S.A.)
        if (isInitialPattern(text, i)) {
          i++;
          continue;
        }

        // Abbreviation check: find the word before this period
        const beforeDot = current.slice(0, -1); // current without the dot
        const wordMatch = beforeDot.match(/(\S+)$/);
        if (wordMatch && isAbbreviation(wordMatch[1])) {
          i++;
          continue;
        }
      }

      // Consume any additional sentence-ending punctuation (!!, ?!, etc.)
      while (i + 1 < text.length && (text[i + 1] === '!' || text[i + 1] === '?' || text[i + 1] === '.')) {
        i++;
        current += text[i];
      }

      // Check if followed by whitespace or end of string (sentence boundary)
      if (i + 1 >= text.length || /\s/.test(text[i + 1])) {
        const trimmed = current.trim();
        if (trimmed) sentences.push(trimmed);
        current = '';
      }

      i++;
      continue;
    }

    current += ch;
    i++;
  }

  // Remaining text
  const trimmed = current.trim();
  if (trimmed) sentences.push(trimmed);

  return sentences;
}

/**
 * Split text into paragraphs on double newlines.
 */
export function tokenizeParagraphs(text: string): string[] {
  if (!text || !text.trim()) return [];

  return text
    .split(/\r?\n\s*\r?\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

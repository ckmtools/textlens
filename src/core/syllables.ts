const EXCEPTIONS: Record<string, number> = {
  'area': 3, 'idea': 3, 'real': 1, 'really': 3, 'rio': 2,
  'beautiful': 3, 'business': 2, 'every': 2, 'everything': 3,
  'different': 3, 'interesting': 4, 'evening': 2, 'experience': 4,
  'chocolate': 3, 'comfortable': 4, 'camera': 3, 'average': 3,
  'being': 2, 'going': 2, 'doing': 2, 'seeing': 2,
  'the': 1, 'he': 1, 'she': 1, 'we': 1, 'me': 1, 'be': 1,
  'are': 1, 'were': 1, 'here': 1, 'there': 1, 'where': 1,
  'their': 1, 'our': 1, 'your': 1, 'hour': 1, 'fire': 1,
  'hire': 1, 'wire': 1, 'tire': 1, 'desire': 2,
  'create': 2, 'created': 3, 'favorite': 3, 'favourite': 3,
  'imagine': 3, 'recipe': 3,
  'people': 2, 'couple': 2, 'trouble': 2, 'double': 2,
  'simple': 2, 'single': 2, 'little': 2, 'middle': 2,
  'file': 1, 'while': 1, 'smile': 1, 'style': 1,
  'whole': 1, 'some': 1, 'come': 1, 'done': 1, 'gone': 1,
  'none': 1, 'one': 1, 'once': 1, 'give': 1, 'have': 1,
  'live': 1, 'love': 1, 'move': 1, 'above': 2,
  'maybe': 2, 'sure': 1, 'pure': 1, 'cure': 1,
  'eyes': 1, 'aisle': 1, 'isle': 1,
  'queue': 1, 'league': 1, 'tongue': 1, 'unique': 2,
  'commune': 2, 'fortune': 2, 'genuine': 3,
  'image': 2, 'language': 2, 'orange': 2, 'storage': 2,
  'usage': 2, 'village': 2, 'courage': 2, 'manage': 2,
  'message': 2, 'package': 2, 'sausage': 2, 'passage': 2,
  'advantage': 3, 'minute': 2, 'continue': 3,
  'creature': 2, 'feature': 2, 'future': 2, 'nature': 2,
  'picture': 2, 'structure': 2, 'temperature': 4,
  'literature': 4, 'furniture': 3, 'adventure': 3,
  'acre': 2, 'fibre': 2, 'centre': 2, 'theatre': 2,
  'somewhere': 2, 'everywhere': 3, 'anywhere': 3, 'nowhere': 2,
  'something': 2, 'nothing': 2, 'anything': 3,
  'ion': 2, 'lion': 2, 'zion': 2,
  'guard': 1, 'guarantee': 3,
  'special': 2, 'social': 2, 'official': 3, 'commercial': 3,
};

function isVowel(ch: string, index: number): boolean {
  if ('aeiou'.includes(ch)) return true;
  // y is a vowel when not word-initial
  if (ch === 'y' && index > 0) return true;
  return false;
}

/**
 * Count syllables in a single word using an enhanced vowel-group heuristic.
 */
export function countSyllables(word: string): number {
  if (!word) return 0;

  // Clean: lowercase, strip non-alpha
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleaned) return 1;

  // Check exceptions
  if (cleaned in EXCEPTIONS) return EXCEPTIONS[cleaned];

  // Count vowel groups
  let count = 0;
  let prevVowel = false;

  for (let i = 0; i < cleaned.length; i++) {
    const v = isVowel(cleaned[i], i);
    if (v && !prevVowel) {
      count++;
    }
    prevVowel = v;
  }

  // Adjustments

  // Silent-e at end: subtract 1, but not for consonant+le (like "table", "people")
  if (cleaned.endsWith('e') && !cleaned.endsWith('le')) {
    // Silent e — subtract if not the only vowel group
    if (count > 1) count--;
  } else if (cleaned.endsWith('le') && cleaned.length > 2) {
    // consonant + le: the 'le' IS a syllable, don't subtract
    const beforeLe = cleaned[cleaned.length - 3];
    if (!isVowel(beforeLe, cleaned.length - 3)) {
      // This is fine — consonant+le is already counted as a vowel group
      // No adjustment needed
    } else {
      // vowel + le, like "ale" — the e might be silent
      if (count > 1) count--;
    }
  }

  // -ed ending: subtract 1 when preceded by consonant other than t/d
  if (cleaned.endsWith('ed') && cleaned.length > 3) {
    const beforeEd = cleaned[cleaned.length - 3];
    if (beforeEd !== 't' && beforeEd !== 'd' && !isVowel(beforeEd, cleaned.length - 3)) {
      if (count > 1) count--;
    }
  }

  // -ion suffix: add 1 (i-on = 2 syllables but counted as 1 vowel group)
  // Skip for -tion/-sion where the "io" is already 1 syllable ("shun" sound)
  if (cleaned.endsWith('ion') && cleaned.length > 3) {
    const beforeIon = cleaned[cleaned.length - 4];
    if (beforeIon !== 't' && beforeIon !== 's') {
      count++;
    }
  }

  // -ia, -ial, -ian, -ious, -ium endings
  if (/(?:ia|ial|ian|ious|ium)$/.test(cleaned)) {
    count++;
  }

  // -eo, -ua, -uo vowel combos (often 2 syllables)
  const diphthongs = cleaned.match(/eo|ua|uo/g);
  if (diphthongs) {
    count += diphthongs.length;
  }

  return Math.max(1, count);
}

/**
 * Sum syllables for all words in the array.
 */
export function countTotalSyllables(words: string[]): number {
  let total = 0;
  for (const word of words) {
    total += countSyllables(word);
  }
  return total;
}

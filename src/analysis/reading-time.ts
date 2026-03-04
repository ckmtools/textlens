import { ReadingTimeResult, ReadingTimeOptions } from '../types';
import { tokenizeWords } from '../core';

export function readingTime(text: string, options?: ReadingTimeOptions): ReadingTimeResult {
  const wpm = options?.wpm ?? 238;
  const imageCount = options?.imageCount ?? 0;

  const wordCount = tokenizeWords(text).length;

  if (wordCount === 0 && imageCount === 0) {
    return { minutes: 0, seconds: 0, words: 0, wpm };
  }

  const baseSeconds = (wordCount / wpm) * 60;

  let imageSeconds = 0;
  for (let i = 0; i < imageCount; i++) {
    imageSeconds += Math.max(12 - i, 3);
  }

  const totalSeconds = baseSeconds + imageSeconds;
  const minutes = Math.ceil(totalSeconds / 60);

  return {
    minutes,
    seconds: Math.round(totalSeconds),
    words: wordCount,
    wpm,
  };
}

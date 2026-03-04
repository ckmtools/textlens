import { describe, it, expect } from 'vitest';
import { sentiment } from '../../src/analysis/sentiment';

describe('sentiment', () => {
  it('should detect positive sentiment', () => {
    const result = sentiment('I love this wonderful amazing beautiful day');
    expect(result.label).toBe('positive');
    expect(result.score).toBeGreaterThan(0);
    expect(result.comparative).toBeGreaterThan(0);
    expect(result.positive.length).toBeGreaterThan(0);
  });

  it('should detect negative sentiment', () => {
    const result = sentiment('This is terrible awful horrible and disgusting');
    expect(result.label).toBe('negative');
    expect(result.score).toBeLessThan(0);
    expect(result.comparative).toBeLessThan(0);
    expect(result.negative.length).toBeGreaterThan(0);
  });

  it('should detect neutral sentiment', () => {
    const result = sentiment('The cat sat on the mat');
    expect(result.label).toBe('neutral');
    expect(Math.abs(result.comparative)).toBeLessThan(0.1);
  });

  it('should handle empty text', () => {
    const result = sentiment('');
    expect(result.label).toBe('neutral');
    expect(result.score).toBe(0);
    expect(result.confidence).toBe(0);
  });

  it('should have confidence between 0 and 1', () => {
    const result = sentiment('I love coding and hate bugs');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('should have score between -1 and 1', () => {
    const result = sentiment('This is absolutely fantastic and wonderful');
    expect(result.score).toBeGreaterThanOrEqual(-1);
    expect(result.score).toBeLessThanOrEqual(1);
  });
});

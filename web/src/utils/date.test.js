import { describe, it, expect } from 'vitest';
import {
  calculateSleepDuration,
  getPrevDateStr,
  localDateStr,
  shiftDateStr,
} from './date.js';

describe('localDateStr & date shifting', () => {
  it('formats local YYYY-MM-DD correctly', () => {
    const d = new Date(2026, 0, 5); // 2026-01-05
    expect(localDateStr(d)).toBe('2026-01-05');
  });

  it('handles month boundaries, year rollovers, and leap years', () => {
    expect(shiftDateStr('2026-03-01', -1)).toBe('2026-02-28');
    expect(shiftDateStr('2024-03-01', -1)).toBe('2024-02-29'); // 2024 leap year
    expect(shiftDateStr('2026-01-01', -1)).toBe('2025-12-31');
    expect(shiftDateStr('2025-12-31', 1)).toBe('2026-01-01');
    expect(getPrevDateStr('2026-11-21')).toBe('2026-11-20');
  });
});

describe('calculateSleepDuration', () => {
  it('computes same-day and overnight sleep durations accurately', () => {
    expect(calculateSleepDuration('23:30', '07:00')).toEqual({
      duration: 7.5,
      bedMinutes: 23 * 60 + 30,
    });
    expect(calculateSleepDuration('01:00', '07:30')).toEqual({
      duration: 6.5,
      bedMinutes: 60,
    });
    expect(calculateSleepDuration('22:00', '22:00')).toEqual({
      duration: 24,
      bedMinutes: 22 * 60,
    });
  });

  it('returns zeroed duration for missing inputs', () => {
    expect(calculateSleepDuration('', '07:00')).toEqual({ duration: 0, bedMinutes: 0 });
    expect(calculateSleepDuration('23:00', '')).toEqual({ duration: 0, bedMinutes: 0 });
  });
});

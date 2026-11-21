import { describe, it, expect } from 'vitest';
import { localDateStr } from '../../utils/date.js';
import {
  TREND_WEEKS,
  trendAggregate,
  trendBuildBuckets,
  trendMondayOf,
} from './trend-weekly.js';
import { TD_DAYS, tdBuildDays } from './trend-detail.js';

describe('weekly trend helpers', () => {
  it('finds Monday of week across Monday, mid-week, and Sunday', () => {
    expect(localDateStr(trendMondayOf(new Date(2026, 10, 16)))).toBe('2026-11-16'); // Mon
    expect(localDateStr(trendMondayOf(new Date(2026, 10, 19)))).toBe('2026-11-16'); // Thu
    expect(localDateStr(trendMondayOf(new Date(2026, 10, 22)))).toBe('2026-11-16'); // Sun
  });

  it('builds 12 continuous Monday-to-Sunday buckets oldest to newest', () => {
    const buckets = trendBuildBuckets(new Date(2026, 10, 21)); // Sat 2026-11-21
    expect(buckets).toHaveLength(TREND_WEEKS);
    expect(buckets[buckets.length - 1]).toEqual({
      start: '2026-11-16',
      end: '2026-11-22',
    });
    expect(buckets[0]).toEqual({
      start: '2026-08-31',
      end: '2026-09-06',
    });
  });

  it('aggregates weekly average/min/max and leaves empty weeks as null', () => {
    const buckets = [
      { start: '2026-11-02', end: '2026-11-08' },
      { start: '2026-11-09', end: '2026-11-15' },
      { start: '2026-11-16', end: '2026-11-22' },
    ];
    const records = [
      { record_date: '2026-11-03', weight_am: 73.0 },
      { record_date: '2026-11-05', weight_am: 72.0 },
      // second week has only missing/null values -> must break cleanly with n=0
      { record_date: '2026-11-10', weight_am: null },
      { record_date: '2026-11-16', weight_am: 71.5 },
      { record_date: '2026-11-17', weight_am: 71.0 },
      { record_date: '2026-11-18', weight_am: 71.8 },
      { record_date: '2026-11-19', weight_am: 70.9 },
    ];

    const aggs = trendAggregate(records, buckets, 'weight_am');
    expect(aggs[0]).toEqual({ avg: 72.5, min: 72.0, max: 73.0, n: 2 });
    expect(aggs[1]).toEqual({ avg: null, min: null, max: null, n: 0 });
    expect(aggs[2].n).toBe(4);
    expect(aggs[2].min).toBe(70.9);
    expect(aggs[2].max).toBe(71.8);
    expect(aggs[2].avg).toBeCloseTo(71.3, 5);
  });
});

describe('60-day trend detail helpers', () => {
  it('builds 60 contiguous calendar days ending at anchorDate', () => {
    const days = tdBuildDays(new Date(2026, 10, 21));
    expect(days).toHaveLength(TD_DAYS);
    expect(days[0]).toBe('2026-09-23');
    expect(days[days.length - 1]).toBe('2026-11-21');
  });
});

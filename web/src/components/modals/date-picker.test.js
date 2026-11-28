import { describe, it, expect } from 'vitest';
import { buildMonthGrid } from './DatePickerModal.js';

describe('DatePickerModal calendar helpers', () => {
  it('always builds a 42-cell (6x7) grid starting on Sunday', () => {
    const grid = buildMonthGrid(2026, 10); // November 2026 (starts on Sunday)
    expect(grid).toHaveLength(42);
    expect(grid[0]).toEqual({ ymd: '2026-11-01', day: 1, inMonth: true });
    expect(grid[29]).toEqual({ ymd: '2026-11-30', day: 30, inMonth: true });
    expect(grid[30]).toEqual({ ymd: '2026-12-01', day: 1, inMonth: false });
  });

  it('handles leap year February (2024) and non-leap February (2026)', () => {
    const leap = buildMonthGrid(2024, 1); // Feb 2024
    const leapDays = leap.filter((c) => c.inMonth);
    expect(leapDays).toHaveLength(29);
    expect(leapDays[leapDays.length - 1].ymd).toBe('2024-02-29');

    const common = buildMonthGrid(2026, 1); // Feb 2026
    const commonDays = common.filter((c) => c.inMonth);
    expect(commonDays).toHaveLength(28);
    expect(commonDays[commonDays.length - 1].ymd).toBe('2026-02-28');
  });
});

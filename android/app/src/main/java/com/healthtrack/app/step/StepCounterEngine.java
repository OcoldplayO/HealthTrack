package com.healthtrack.app.step;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

/**
 * 纯 Java 计步状态机，与 Android Framework 解耦，便于单测验证所有跨日与重启边界。
 */
public final class StepCounterEngine {
    public static final long MIDNIGHT_WINDOW_MS = 45L * 60_000L;
    public static final long RECENT_NIGHT_BOOT_WINDOW_MS = 2L * 60L * 60_000L;
    public static final long MAX_DAILY_STEPS = 100_000L;

    public static final String SOURCE_MIDNIGHT_JOB = "midnight_job";
    public static final String SOURCE_BOOT_TODAY = "boot_today";
    public static final String SOURCE_INIT_BOOT_TODAY = "init_boot_today";
    public static final String SOURCE_INIT_RAW = "init_raw";
    public static final String SOURCE_ROLLOVER_LAST_RAW = "rollover_last_raw";
    public static final String SOURCE_ROLLOVER_REBOOT_RECENT = "rollover_reboot_recent";
    public static final String SOURCE_ROLLOVER_RESET = "rollover_reset";

    private StepCounterEngine() {
    }

    public static final class StepState {
        public final String lastDate;
        public final long baseline;
        public final long rebootOffset;
        public final long lastRaw;
        public final int todaySteps;
        public final int lastBootCount;
        public final long lastRawTime;
        public final long baselineTime;
        public final String baselineSource;

        public StepState(
                String lastDate,
                long baseline,
                long rebootOffset,
                long lastRaw,
                int todaySteps,
                int lastBootCount,
                long lastRawTime,
                long baselineTime,
                String baselineSource) {
            this.lastDate = lastDate;
            this.baseline = baseline;
            this.rebootOffset = rebootOffset;
            this.lastRaw = lastRaw;
            this.todaySteps = todaySteps;
            this.lastBootCount = lastBootCount;
            this.lastRawTime = lastRawTime;
            this.baselineTime = baselineTime;
            this.baselineSource = baselineSource != null ? baselineSource : "";
        }

        public static StepState empty() {
            return new StepState(null, -1L, 0L, -1L, -1, -1, -1L, -1L, "");
        }
    }

    /**
     * 纯只读查询当前缓存的今日步数，不修改任何状态。
     */
    public static int readCachedTodaySteps(StepState state, long nowMs, TimeZone tz) {
        if (state == null || state.lastDate == null) {
            return -1;
        }
        String today = formatDate(nowMs, tz);
        if (!today.equals(state.lastDate)) {
            return 0;
        }
        return state.todaySteps;
    }

    /**
     * 处理一次来自硬件传感器的原始累计读数，返回更新后的不可变状态。
     */
    public static StepState applySample(
            StepState current,
            long raw,
            long nowMs,
            long elapsedRealtimeMs,
            int bootCount,
            boolean isMidnightJob,
            TimeZone tz) {
        StepState state = current != null ? current : StepState.empty();
        if (raw < 0) {
            return state;
        }

        TimeZone zone = tz != null ? tz : TimeZone.getDefault();
        String today = formatDate(nowMs, zone);
        long todayStartMs = startOfDayMillis(nowMs, zone);
        long bootTimeMs = elapsedRealtimeMs >= 0L ? (nowMs - elapsedRealtimeMs) : -1L;
        boolean bootedToday = elapsedRealtimeMs >= 0L && bootTimeMs >= todayStartMs;
        boolean inMidnightWindow = nowMs >= todayStartMs && nowMs < (todayStartMs + MIDNIGHT_WINDOW_MS);

        // 1. 零点定时打基线（仅在 00:00 ~ 00:45 窗口内生效，避免 Doze 延迟到白天后抹除晨间步数）
        if (isMidnightJob && inMidnightWindow) {
            boolean alreadyAnchoredToday = today.equals(state.lastDate)
                    && state.baseline >= 0L
                    && (SOURCE_MIDNIGHT_JOB.equals(state.baselineSource)
                    || SOURCE_BOOT_TODAY.equals(state.baselineSource)
                    || SOURCE_INIT_BOOT_TODAY.equals(state.baselineSource));
            if (!alreadyAnchoredToday) {
                return new StepState(
                        today,
                        raw,
                        0L,
                        raw,
                        0,
                        bootCount,
                        nowMs,
                        nowMs,
                        SOURCE_MIDNIGHT_JOB);
            }
            // 若今日已锚定过有效零点/开机基线，则按常规同日采样处理
        }

        // 2. 首次初始化
        if (state.lastDate == null || state.baseline < 0L || state.lastRaw < 0L) {
            if (bootedToday) {
                return new StepState(
                        today,
                        0L,
                        0L,
                        raw,
                        clampSteps(raw),
                        bootCount,
                        nowMs,
                        bootTimeMs,
                        SOURCE_INIT_BOOT_TODAY);
            }
            return new StepState(
                    today,
                    raw,
                    0L,
                    raw,
                    0,
                    bootCount,
                    nowMs,
                    nowMs,
                    SOURCE_INIT_RAW);
        }

        // 3. 同日更新（含同日单次及多次重启识别）
        if (today.equals(state.lastDate)) {
            boolean rebooted = isRebootDetected(raw, state.lastRaw, bootCount, state.lastBootCount);
            if (rebooted) {
                long prevToday = Math.max(0L, (state.lastRaw + state.rebootOffset) - state.baseline);
                long newTotal = prevToday + raw;
                return new StepState(
                        today,
                        0L,
                        prevToday,
                        raw,
                        clampSteps(newTotal),
                        bootCount,
                        nowMs,
                        state.baselineTime,
                        state.baselineSource);
            }
            long calc = Math.max(0L, (raw + state.rebootOffset) - state.baseline);
            return new StepState(
                    today,
                    state.baseline,
                    state.rebootOffset,
                    raw,
                    clampSteps(calc),
                    bootCount,
                    nowMs,
                    state.baselineTime,
                    state.baselineSource);
        }

        // 4. 跨日切换
        if (bootedToday) {
            // 今日 00:00 之后才开过机：当前硬件计步读数全部属于今天
            return new StepState(
                    today,
                    0L,
                    0L,
                    raw,
                    clampSteps(raw),
                    bootCount,
                    nowMs,
                    bootTimeMs,
                    SOURCE_BOOT_TODAY);
        }

        long gap = daysBetween(state.lastDate, today);
        if (gap == 1L) {
            boolean rebooted = isRebootDetected(raw, state.lastRaw, bootCount, state.lastBootCount);
            if (rebooted) {
                if (elapsedRealtimeMs >= 0L && bootTimeMs >= (todayStartMs - RECENT_NIGHT_BOOT_WINDOW_MS)) {
                    // 昨晚临睡前（22:00~24:00）刚重启过，硬件读数大概率属于今日
                    return new StepState(
                            today,
                            0L,
                            0L,
                            raw,
                            clampSteps(raw),
                            bootCount,
                            nowMs,
                            bootTimeMs,
                            SOURCE_ROLLOVER_REBOOT_RECENT);
                }
                return new StepState(
                        today,
                        raw,
                        0L,
                        raw,
                        0,
                        bootCount,
                        nowMs,
                        nowMs,
                        SOURCE_ROLLOVER_RESET);
            }
            long calc = Math.max(0L, raw - state.lastRaw);
            long bTime = state.lastRawTime > 0L ? state.lastRawTime : nowMs;
            return new StepState(
                    today,
                    state.lastRaw,
                    0L,
                    raw,
                    clampSteps(calc),
                    bootCount,
                    nowMs,
                    bTime,
                    SOURCE_ROLLOVER_LAST_RAW);
        }

        // 多日未打开或系统日期回拨：用当前读数重新立基线，避免累积多天步数
        return new StepState(
                today,
                raw,
                0L,
                raw,
                0,
                bootCount,
                nowMs,
                nowMs,
                SOURCE_ROLLOVER_RESET);
    }

    private static boolean isRebootDetected(long raw, long lastRaw, int bootCount, int lastBootCount) {
        if (bootCount >= 0 && lastBootCount >= 0 && bootCount != lastBootCount) {
            return true;
        }
        return lastRaw > 0L && raw < lastRaw;
    }

    private static int clampSteps(long steps) {
        if (steps <= 0L) {
            return 0;
        }
        return (int) Math.min(steps, MAX_DAILY_STEPS);
    }

    public static String formatDate(long nowMs, TimeZone tz) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        sdf.setTimeZone(tz != null ? tz : TimeZone.getDefault());
        return sdf.format(new Date(nowMs));
    }

    public static long startOfDayMillis(long nowMs, TimeZone tz) {
        Calendar cal = Calendar.getInstance(tz != null ? tz : TimeZone.getDefault(), Locale.US);
        cal.setTimeInMillis(nowMs);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTimeInMillis();
    }

    public static long daysBetween(String fromYmd, String toYmd) {
        if (fromYmd == null || toYmd == null) {
            return -1L;
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        try {
            Date from = sdf.parse(fromYmd);
            Date to = sdf.parse(toYmd);
            if (from == null || to == null) {
                return -1L;
            }
            return (to.getTime() - from.getTime()) / 86400000L;
        } catch (ParseException e) {
            return -1L;
        }
    }
}

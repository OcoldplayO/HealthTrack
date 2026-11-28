package com.healthtrack.app.step;

import android.app.job.JobInfo;
import android.app.job.JobParameters;
import android.app.job.JobScheduler;
import android.app.job.JobService;
import android.content.ComponentName;
import android.content.Context;
import android.util.Log;

import java.util.Calendar;

/**
 * 每日零点（00:05）打基线与每 2 小时定期采样快照的系统 JobService（纯 Android Framework 实现）。
 */
public final class StepBaselineJobService extends JobService {
    private static final String TAG = "StepBaselineJob";
    public static final int JOB_ID = 20261;
    public static final int PERIODIC_JOB_ID = 20262;
    private static final long MIN_DELAY_MS = 60_000L;
    private static final long FLEX_WINDOW_MS = 15L * 60_000L;
    private static final long PERIODIC_INTERVAL_MS = 2L * 60L * 60_000L;
    private static final long PERIODIC_FLEX_MS = 30L * 60_000L;

    public static void scheduleNextMidnight(Context context) {
        scheduleNextMidnight(context, false);
    }

    public static void scheduleAll(Context context, boolean forceReschedule) {
        scheduleNextMidnight(context, forceReschedule);
        schedulePeriodicSnapshot(context, forceReschedule);
    }

    public static void scheduleNextMidnight(Context context, boolean forceReschedule) {
        if (context == null) {
            return;
        }
        Context appCtx = context.getApplicationContext();
        StepManager manager = StepManager.getInstance(appCtx);
        if (!manager.isAvailable() || !manager.hasPermission()) {
            return;
        }

        JobScheduler scheduler = (JobScheduler) appCtx.getSystemService(Context.JOB_SCHEDULER_SERVICE);
        if (scheduler == null) {
            return;
        }
        if (!forceReschedule && scheduler.getPendingJob(JOB_ID) != null) {
            return;
        }

        long delayMs = computeDelayToNextMidnight();
        JobInfo job = new JobInfo.Builder(JOB_ID, new ComponentName(appCtx, StepBaselineJobService.class))
                .setMinimumLatency(delayMs)
                .setOverrideDeadline(delayMs + FLEX_WINDOW_MS)
                .setPersisted(true)
                .build();

        int result = scheduler.schedule(job);
        if (result != JobScheduler.RESULT_SUCCESS) {
            Log.w(TAG, "调度次日计步基线任务失败: " + result);
        }
    }

    public static void schedulePeriodicSnapshot(Context context, boolean forceReschedule) {
        if (context == null) {
            return;
        }
        Context appCtx = context.getApplicationContext();
        StepManager manager = StepManager.getInstance(appCtx);
        if (!manager.isAvailable() || !manager.hasPermission()) {
            return;
        }

        JobScheduler scheduler = (JobScheduler) appCtx.getSystemService(Context.JOB_SCHEDULER_SERVICE);
        if (scheduler == null) {
            return;
        }
        if (!forceReschedule && scheduler.getPendingJob(PERIODIC_JOB_ID) != null) {
            return;
        }

        JobInfo job = new JobInfo.Builder(PERIODIC_JOB_ID, new ComponentName(appCtx, StepBaselineJobService.class))
                .setPeriodic(PERIODIC_INTERVAL_MS, PERIODIC_FLEX_MS)
                .setPersisted(true)
                .build();

        int result = scheduler.schedule(job);
        if (result != JobScheduler.RESULT_SUCCESS) {
            Log.w(TAG, "调度周期计步快照任务失败: " + result);
        }
    }

    private static long computeDelayToNextMidnight() {
        Calendar now = Calendar.getInstance();
        Calendar next = (Calendar) now.clone();
        next.add(Calendar.DAY_OF_YEAR, 1);
        next.set(Calendar.HOUR_OF_DAY, 0);
        next.set(Calendar.MINUTE, 5);
        next.set(Calendar.SECOND, 0);
        next.set(Calendar.MILLISECOND, 0);

        long diff = next.getTimeInMillis() - now.getTimeInMillis();
        return Math.max(diff, MIN_DELAY_MS);
    }

    @Override
    public boolean onStartJob(JobParameters params) {
        StepManager manager = StepManager.getInstance(this);
        int jobId = params != null ? params.getJobId() : JOB_ID;

        if (!manager.isAvailable() || !manager.hasPermission()) {
            if (jobId == JOB_ID) {
                scheduleNextMidnight(this, true);
            }
            return false;
        }

        if (jobId == PERIODIC_JOB_ID) {
            manager.sampleOnce(() -> jobFinished(params, false));
            return true;
        }

        manager.sampleMidnightBaseline(() -> {
            scheduleNextMidnight(getApplicationContext(), true);
            jobFinished(params, false);
        });
        return true;
    }

    @Override
    public boolean onStopJob(JobParameters params) {
        return false;
    }
}

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
 * 每日零点（00:05）定时对硬件计步器采样打基线的系统 JobService（纯 Android Framework 实现）。
 */
public final class StepBaselineJobService extends JobService {
    private static final String TAG = "StepBaselineJob";
    public static final int JOB_ID = 20261;
    private static final long MIN_DELAY_MS = 60_000L;
    private static final long FLEX_WINDOW_MS = 30L * 60_000L;

    public static void scheduleNextMidnight(Context context) {
        scheduleNextMidnight(context, false);
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
        if (!manager.isAvailable() || !manager.hasPermission()) {
            scheduleNextMidnight(this, true);
            return false;
        }

        manager.sampleOnce(() -> {
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

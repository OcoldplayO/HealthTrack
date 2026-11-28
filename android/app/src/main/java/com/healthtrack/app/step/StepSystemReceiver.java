package com.healthtrack.app.step;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/**
 * 监听系统开机与关机广播，保障计步快照在关机前落盘并在开机后立即重调度。
 */
public final class StepSystemReceiver extends BroadcastReceiver {
    private static final String TAG = "StepSystemReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (context == null || intent == null) {
            return;
        }
        String action = intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(action)) {
            Log.i(TAG, "收到开机广播，重新调度计步任务");
            StepBaselineJobService.scheduleAll(context, true);
        } else if (Intent.ACTION_SHUTDOWN.equals(action)) {
            StepManager manager = StepManager.getInstance(context);
            if (!manager.isAvailable() || !manager.hasPermission()) {
                return;
            }
            Log.i(TAG, "收到关机广播，触发关机前步数刷盘");
            final PendingResult pendingResult = goAsync();
            manager.sampleOnce(() -> {
                try {
                    pendingResult.finish();
                } catch (Throwable ignored) {
                }
            });
        }
    }
}

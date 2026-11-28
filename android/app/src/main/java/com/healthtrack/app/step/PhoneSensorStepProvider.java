package com.healthtrack.app.step;

import android.Manifest;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.provider.Settings;
import android.util.Log;

import java.util.Locale;
import java.util.TimeZone;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 基于 Android 原生硬件传感器 TYPE_STEP_COUNTER 的计步实现。
 * 委托 StepCounterEngine 处理零点基准、跨日消歧与重启补偿，并支持硬件 FIFO flush 与同步落盘。
 */
public final class PhoneSensorStepProvider implements StepProvider, SensorEventListener {
    private static final String TAG = "PhoneStepProvider";
    private static final String PREFS_NAME = "healthtrack_step_pref";
    private static final String KEY_LAST_DATE = "last_date";
    private static final String KEY_BASELINE = "baseline";
    private static final String KEY_REBOOT_OFFSET = "reboot_offset";
    private static final String KEY_LAST_RAW = "last_raw";
    private static final String KEY_TODAY_STEPS = "today_steps";
    private static final String KEY_LAST_BOOT_COUNT = "last_boot_count";
    private static final String KEY_LAST_RAW_TIME = "last_raw_time";
    private static final String KEY_BASELINE_TIME = "baseline_time";
    private static final String KEY_BASELINE_SOURCE = "baseline_source";

    private static final long SAMPLE_TIMEOUT_MS = 5000L;
    private static final long REFRESH_TIMEOUT_MS = 2500L;

    private final Context context;
    private final SensorManager sensorManager;
    private final Sensor stepSensor;
    private final SharedPreferences prefs;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private boolean isListening = false;
    private StepUpdateListener updateListener;
    private int lastNotifiedSteps = -1;

    public PhoneSensorStepProvider(Context context) {
        this.context = context.getApplicationContext();
        this.sensorManager = (SensorManager) this.context.getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager != null) {
            this.stepSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        } else {
            this.stepSensor = null;
        }
        this.prefs = this.context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    @Override
    public boolean isAvailable() {
        return stepSensor != null;
    }

    @Override
    public boolean hasPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            return context.checkSelfPermission(Manifest.permission.ACTIVITY_RECOGNITION) == PackageManager.PERMISSION_GRANTED;
        }
        return true;
    }

    @Override
    public synchronized void setUpdateListener(StepUpdateListener listener) {
        this.updateListener = listener;
        this.lastNotifiedSteps = -1;
    }

    @Override
    public synchronized void start() {
        if (!isAvailable() || !hasPermission()) {
            return;
        }
        if (!isListening && sensorManager != null && stepSensor != null) {
            boolean ok = sensorManager.registerListener(this, stepSensor, SensorManager.SENSOR_DELAY_UI, 0);
            if (ok) {
                isListening = true;
                sensorManager.flush(this);
            } else {
                Log.w(TAG, "注册计步传感器监听失败");
            }
        } else if (isListening && sensorManager != null) {
            sensorManager.flush(this);
        }
    }

    @Override
    public synchronized void stop() {
        if (isListening && sensorManager != null) {
            sensorManager.unregisterListener(this);
            isListening = false;
        }
    }

    @Override
    public synchronized int getTodaySteps() {
        if (!isAvailable()) {
            return -1;
        }
        StepCounterEngine.StepState state = loadState();
        return StepCounterEngine.readCachedTodaySteps(state, System.currentTimeMillis(), TimeZone.getDefault());
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event == null || event.values == null || event.values.length == 0) {
            return;
        }
        long raw = (long) event.values[0];
        if (raw < 0L) {
            return;
        }
        processRawSample(raw, false, false);
    }

    @Override
    public void sampleOnce(Runnable onComplete) {
        sampleInternal(false, true, SAMPLE_TIMEOUT_MS, onComplete);
    }

    @Override
    public void sampleMidnightBaseline(Runnable onComplete) {
        sampleInternal(true, true, SAMPLE_TIMEOUT_MS, onComplete);
    }

    @Override
    public void refreshNow(Runnable onComplete) {
        synchronized (this) {
            if (isListening && sensorManager != null) {
                sensorManager.flush(this);
            }
        }
        sampleInternal(false, false, REFRESH_TIMEOUT_MS, onComplete);
    }

    @Override
    public synchronized String getDebugInfo() {
        StepCounterEngine.StepState s = loadState();
        return String.format(
                Locale.US,
                "date=%s,steps=%d,raw=%d,base=%d,off=%d,src=%s,bc=%d->%d,up=%dms",
                s.lastDate,
                s.todaySteps,
                s.lastRaw,
                s.baseline,
                s.rebootOffset,
                s.baselineSource,
                s.lastBootCount,
                readBootCount(),
                SystemClock.elapsedRealtime());
    }

    private void sampleInternal(
            boolean isMidnightJob,
            boolean syncCommit,
            long timeoutMs,
            Runnable onComplete) {
        if (!isAvailable() || !hasPermission() || sensorManager == null || stepSensor == null) {
            if (onComplete != null) {
                onComplete.run();
            }
            return;
        }

        final AtomicBoolean finished = new AtomicBoolean(false);
        final SensorEventListener oneShotListener = new SensorEventListener() {
            @Override
            public void onSensorChanged(SensorEvent event) {
                if (event != null && event.values != null && event.values.length > 0) {
                    long raw = (long) event.values[0];
                    if (raw >= 0L) {
                        processRawSample(raw, isMidnightJob, syncCommit);
                    }
                }
                if (finished.compareAndSet(false, true)) {
                    sensorManager.unregisterListener(this);
                    if (onComplete != null) {
                        onComplete.run();
                    }
                }
            }

            @Override
            public void onAccuracyChanged(Sensor sensor, int accuracy) {
            }
        };

        boolean registered = sensorManager.registerListener(
                oneShotListener,
                stepSensor,
                SensorManager.SENSOR_DELAY_UI,
                0);
        if (!registered) {
            if (finished.compareAndSet(false, true) && onComplete != null) {
                onComplete.run();
            }
            return;
        }
        sensorManager.flush(oneShotListener);

        mainHandler.postDelayed(() -> {
            if (finished.compareAndSet(false, true)) {
                sensorManager.unregisterListener(oneShotListener);
                Log.w(TAG, "单次计步采样超时 (midnight=" + isMidnightJob + ", timeoutMs=" + timeoutMs + ")");
                if (onComplete != null) {
                    onComplete.run();
                }
            }
        }, timeoutMs);
    }

    private void processRawSample(long raw, boolean isMidnightJob, boolean syncCommit) {
        int notified = -1;
        StepUpdateListener listenerSnapshot;

        synchronized (this) {
            StepCounterEngine.StepState prev = loadState();
            long nowMs = System.currentTimeMillis();
            long elapsedMs = SystemClock.elapsedRealtime();
            int bootCount = readBootCount();

            StepCounterEngine.StepState next = StepCounterEngine.applySample(
                    prev,
                    raw,
                    nowMs,
                    elapsedMs,
                    bootCount,
                    isMidnightJob,
                    TimeZone.getDefault());

            saveState(next, syncCommit);

            boolean baselineChanged = prev.baseline != next.baseline
                    || !next.baselineSource.equals(prev.baselineSource)
                    || (prev.lastDate == null || !prev.lastDate.equals(next.lastDate));
            if (baselineChanged || isMidnightJob || syncCommit) {
                Log.i(TAG, String.format(
                        Locale.US,
                        "sample midnight=%b sync=%b date=%s raw=%d base=%d off=%d steps=%d src=%s bc=%d",
                        isMidnightJob,
                        syncCommit,
                        next.lastDate,
                        next.lastRaw,
                        next.baseline,
                        next.rebootOffset,
                        next.todaySteps,
                        next.baselineSource,
                        next.lastBootCount));
            }

            listenerSnapshot = updateListener;
            if (listenerSnapshot != null && next.todaySteps != lastNotifiedSteps) {
                lastNotifiedSteps = next.todaySteps;
                notified = next.todaySteps;
            }
        }

        if (listenerSnapshot != null && notified >= 0) {
            listenerSnapshot.onStepsUpdated(notified);
        }
    }

    private StepCounterEngine.StepState loadState() {
        return new StepCounterEngine.StepState(
                prefs.getString(KEY_LAST_DATE, null),
                prefs.getLong(KEY_BASELINE, -1L),
                prefs.getLong(KEY_REBOOT_OFFSET, 0L),
                prefs.getLong(KEY_LAST_RAW, -1L),
                prefs.getInt(KEY_TODAY_STEPS, -1),
                prefs.getInt(KEY_LAST_BOOT_COUNT, -1),
                prefs.getLong(KEY_LAST_RAW_TIME, -1L),
                prefs.getLong(KEY_BASELINE_TIME, -1L),
                prefs.getString(KEY_BASELINE_SOURCE, ""));
    }

    private void saveState(StepCounterEngine.StepState state, boolean syncCommit) {
        SharedPreferences.Editor editor = prefs.edit()
                .putString(KEY_LAST_DATE, state.lastDate)
                .putLong(KEY_BASELINE, state.baseline)
                .putLong(KEY_REBOOT_OFFSET, state.rebootOffset)
                .putLong(KEY_LAST_RAW, state.lastRaw)
                .putInt(KEY_TODAY_STEPS, state.todaySteps)
                .putInt(KEY_LAST_BOOT_COUNT, state.lastBootCount)
                .putLong(KEY_LAST_RAW_TIME, state.lastRawTime)
                .putLong(KEY_BASELINE_TIME, state.baselineTime)
                .putString(KEY_BASELINE_SOURCE, state.baselineSource);
        if (syncCommit) {
            editor.commit();
        } else {
            editor.apply();
        }
    }

    private int readBootCount() {
        try {
            return Settings.Global.getInt(context.getContentResolver(), Settings.Global.BOOT_COUNT, -1);
        } catch (Throwable ignored) {
            return -1;
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // 计步器无需处理精度变化
    }
}

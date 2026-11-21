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
import android.util.Log;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 基于 Android 原生硬件传感器 TYPE_STEP_COUNTER 的计步实现。
 * 具备跨日基准点统一消歧、关机重启步数累加补偿以及单次定时采样打基线能力。
 */
public final class PhoneSensorStepProvider implements StepProvider, SensorEventListener {
    private static final String TAG = "PhoneStepProvider";
    private static final String PREFS_NAME = "healthtrack_step_pref";
    private static final String KEY_LAST_DATE = "last_date";
    private static final String KEY_BASELINE = "baseline";
    private static final String KEY_REBOOT_OFFSET = "reboot_offset";
    private static final String KEY_LAST_RAW = "last_raw";
    private static final String KEY_TODAY_STEPS = "today_steps";
    private static final long SAMPLE_TIMEOUT_MS = 5000L;

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
            boolean ok = sensorManager.registerListener(this, stepSensor, SensorManager.SENSOR_DELAY_UI);
            if (ok) {
                isListening = true;
            } else {
                Log.w(TAG, "注册计步传感器监听失败");
            }
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
        String today = getTodayDateStr();
        String savedDate = prefs.getString(KEY_LAST_DATE, null);
        if (savedDate == null) {
            return -1;
        }
        if (!savedDate.equals(today)) {
            long gap = daysBetween(savedDate, today);
            if (gap == 1) {
                rolloverIfNeeded(today, -1L);
            }
            return 0;
        }
        return prefs.getInt(KEY_TODAY_STEPS, -1);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event == null || event.values == null || event.values.length == 0) {
            return;
        }
        long raw = (long) event.values[0];
        if (raw < 0) {
            return;
        }

        int notified = -1;
        StepUpdateListener listenerSnapshot;
        synchronized (this) {
            String today = getTodayDateStr();
            rolloverIfNeeded(today, raw);

            long baseline = prefs.getLong(KEY_BASELINE, raw);
            long rebootOffset = prefs.getLong(KEY_REBOOT_OFFSET, 0);
            long lastRaw = prefs.getLong(KEY_LAST_RAW, raw);

            // 设备重启补偿：当前累计步数小于上次记录的 lastRaw
            if (lastRaw > 0 && raw < lastRaw) {
                rebootOffset += lastRaw;
            }

            long calculated = (raw + rebootOffset) - baseline;
            if (calculated < 0) {
                calculated = 0;
            }
            int todaySteps = (int) Math.min(calculated, 100000L);

            prefs.edit()
                    .putString(KEY_LAST_DATE, today)
                    .putLong(KEY_BASELINE, baseline)
                    .putLong(KEY_REBOOT_OFFSET, rebootOffset)
                    .putLong(KEY_LAST_RAW, raw)
                    .putInt(KEY_TODAY_STEPS, todaySteps)
                    .apply();

            listenerSnapshot = updateListener;
            if (listenerSnapshot != null && todaySteps != lastNotifiedSteps) {
                lastNotifiedSteps = todaySteps;
                notified = todaySteps;
            }
        }

        if (listenerSnapshot != null && notified >= 0) {
            listenerSnapshot.onStepsUpdated(notified);
        }
    }

    @Override
    public void sampleOnce(Runnable onComplete) {
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
                PhoneSensorStepProvider.this.onSensorChanged(event);
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

        boolean registered = sensorManager.registerListener(oneShotListener, stepSensor, SensorManager.SENSOR_DELAY_NORMAL);
        if (!registered) {
            if (finished.compareAndSet(false, true) && onComplete != null) {
                onComplete.run();
            }
            return;
        }

        mainHandler.postDelayed(() -> {
            if (finished.compareAndSet(false, true)) {
                sensorManager.unregisterListener(oneShotListener);
                if (onComplete != null) {
                    onComplete.run();
                }
            }
        }, SAMPLE_TIMEOUT_MS);
    }

    /**
     * 统一跨日基线切换逻辑，消除 getTodaySteps() 与 onSensorChanged() 之间的时序竞态：
     * - 若恰为正常跨日（gap == 1）且存在昨日 lastRaw，则沿用昨日 lastRaw 作为今日基线（不丢今晨未开 App 前步数）；
     *   同时保留 KEY_LAST_RAW 原值以便紧随其后的重启补偿逻辑继续生效。
     * - 若首次初始化或多日未打开 / 系统时间回拨（gap != 1），仅当拿到真实 raw 时将其设为今日新基线。
     */
    private synchronized void rolloverIfNeeded(String today, long currentRawOrNeg) {
        String savedDate = prefs.getString(KEY_LAST_DATE, null);
        long baseline = prefs.getLong(KEY_BASELINE, -1);
        long lastRaw = prefs.getLong(KEY_LAST_RAW, -1);

        if (savedDate == null || baseline < 0 || lastRaw < 0) {
            if (currentRawOrNeg < 0) {
                return;
            }
            prefs.edit()
                    .putString(KEY_LAST_DATE, today)
                    .putLong(KEY_BASELINE, currentRawOrNeg)
                    .putLong(KEY_REBOOT_OFFSET, 0L)
                    .putLong(KEY_LAST_RAW, currentRawOrNeg)
                    .putInt(KEY_TODAY_STEPS, 0)
                    .apply();
            return;
        }

        if (savedDate.equals(today)) {
            return;
        }

        long gap = daysBetween(savedDate, today);
        if (gap == 1) {
            // 正常跨日：以昨日最后硬件读数作基线，不早退、不覆写 lastRaw，保留重启补偿能力
            prefs.edit()
                    .putString(KEY_LAST_DATE, today)
                    .putLong(KEY_BASELINE, lastRaw)
                    .putLong(KEY_REBOOT_OFFSET, 0L)
                    .putInt(KEY_TODAY_STEPS, 0)
                    .apply();
            return;
        }

        if (currentRawOrNeg >= 0) {
            prefs.edit()
                    .putString(KEY_LAST_DATE, today)
                    .putLong(KEY_BASELINE, currentRawOrNeg)
                    .putLong(KEY_REBOOT_OFFSET, 0L)
                    .putLong(KEY_LAST_RAW, currentRawOrNeg)
                    .putInt(KEY_TODAY_STEPS, 0)
                    .apply();
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // 计步器无需处理精度变化
    }

    private String getTodayDateStr() {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
    }

    private static long daysBetween(String fromYmd, String toYmd) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        try {
            Date from = sdf.parse(fromYmd);
            Date to = sdf.parse(toYmd);
            if (from == null || to == null) {
                return -1;
            }
            return (to.getTime() - from.getTime()) / 86400000L;
        } catch (ParseException e) {
            return -1;
        }
    }
}

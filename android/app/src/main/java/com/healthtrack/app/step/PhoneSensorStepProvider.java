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
import android.util.Log;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * 基于 Android 原生硬件传感器 TYPE_STEP_COUNTER 的计步实现。
 * 具备跨日基准点重置、关机重启步数累加补偿以及极低功耗被动采样特性。
 */
public final class PhoneSensorStepProvider implements StepProvider, SensorEventListener {
    private static final String TAG = "PhoneStepProvider";
    private static final String PREFS_NAME = "healthtrack_step_pref";
    private static final String KEY_LAST_DATE = "last_date";
    private static final String KEY_BASELINE = "baseline";
    private static final String KEY_REBOOT_OFFSET = "reboot_offset";
    private static final String KEY_LAST_RAW = "last_raw";
    private static final String KEY_TODAY_STEPS = "today_steps";

    private final Context context;
    private final SensorManager sensorManager;
    private final Sensor stepSensor;
    private final SharedPreferences prefs;
    private boolean isListening = false;

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

        // 若日期变更但尚未收到新的传感器事件，先完成平滑跨日归零
        if (savedDate != null && !savedDate.equals(today)) {
            long lastRaw = prefs.getLong(KEY_LAST_RAW, -1);
            if (lastRaw >= 0) {
                prefs.edit()
                        .putString(KEY_LAST_DATE, today)
                        .putLong(KEY_BASELINE, lastRaw)
                        .putLong(KEY_REBOOT_OFFSET, 0)
                        .putInt(KEY_TODAY_STEPS, 0)
                        .apply();
            }
            return 0;
        }

        return prefs.getInt(KEY_TODAY_STEPS, -1);
    }

    @Override
    public synchronized void onSensorChanged(SensorEvent event) {
        if (event == null || event.values == null || event.values.length == 0) {
            return;
        }
        long raw = (long) event.values[0];
        if (raw < 0) {
            return;
        }

        String today = getTodayDateStr();
        String savedDate = prefs.getString(KEY_LAST_DATE, null);
        long baseline = prefs.getLong(KEY_BASELINE, -1);
        long rebootOffset = prefs.getLong(KEY_REBOOT_OFFSET, 0);
        long lastRaw = prefs.getLong(KEY_LAST_RAW, -1);

        // 1. 首次初始化或跨日重置
        if (savedDate == null || !savedDate.equals(today) || baseline < 0) {
            baseline = raw;
            rebootOffset = 0;
            savedDate = today;
            lastRaw = raw;
            int todaySteps = 0;
            prefs.edit()
                    .putString(KEY_LAST_DATE, savedDate)
                    .putLong(KEY_BASELINE, baseline)
                    .putLong(KEY_REBOOT_OFFSET, rebootOffset)
                    .putLong(KEY_LAST_RAW, lastRaw)
                    .putInt(KEY_TODAY_STEPS, todaySteps)
                    .apply();
            return;
        }

        // 2. 检测设备重启补偿（当前 raw 小于上次记录的 lastRaw）
        if (lastRaw > 0 && raw < lastRaw) {
            rebootOffset += lastRaw;
        }

        // 3. 计算今日累计步数
        long calculated = (raw + rebootOffset) - baseline;
        if (calculated < 0) {
            calculated = 0;
        }
        int todaySteps = (int) Math.min(calculated, 100000L);

        prefs.edit()
                .putString(KEY_LAST_DATE, savedDate)
                .putLong(KEY_BASELINE, baseline)
                .putLong(KEY_REBOOT_OFFSET, rebootOffset)
                .putLong(KEY_LAST_RAW, raw)
                .putInt(KEY_TODAY_STEPS, todaySteps)
                .apply();
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // 计步器无需处理精度变化
    }

    private String getTodayDateStr() {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());
    }
}

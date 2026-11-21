package com.healthtrack.app.step;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;

/**
 * 步数中心管理器。
 * 负责调度具体的数据提供者（手机传感器或未来扩展的手表/健康连接），
 * 并提供运行时权限请求与统一状态查询。
 */
public final class StepManager {
    private static volatile StepManager instance;

    private final Context context;
    private StepProvider activeProvider;
    private StepProvider.StepUpdateListener updateListener;

    private StepManager(Context context) {
        this.context = context.getApplicationContext();
        // 默认挂载手机硬件传感器提供者
        this.activeProvider = new PhoneSensorStepProvider(this.context);
    }

    public static StepManager getInstance(Context context) {
        if (instance == null) {
            synchronized (StepManager.class) {
                if (instance == null) {
                    instance = new StepManager(context);
                }
            }
        }
        return instance;
    }

    /**
     * 允许未来动态切换或注入穿戴设备提供者（例如 HealthConnectStepProvider）
     */
    public synchronized void setProvider(StepProvider provider) {
        if (provider != null) {
            if (this.activeProvider != null) {
                this.activeProvider.setUpdateListener(null);
                this.activeProvider.stop();
            }
            this.activeProvider = provider;
            this.activeProvider.setUpdateListener(this.updateListener);
            this.activeProvider.start();
        }
    }

    public synchronized void setListener(StepProvider.StepUpdateListener listener) {
        this.updateListener = listener;
        if (activeProvider != null) {
            activeProvider.setUpdateListener(listener);
        }
    }

    public synchronized void start() {
        if (activeProvider != null) {
            activeProvider.start();
        }
    }

    public synchronized void stop() {
        if (activeProvider != null) {
            activeProvider.stop();
        }
    }

    public synchronized boolean isAvailable() {
        return activeProvider != null && activeProvider.isAvailable();
    }

    public synchronized boolean hasPermission() {
        return activeProvider != null && activeProvider.hasPermission();
    }

    public synchronized int getTodaySteps() {
        if (activeProvider == null) {
            return -1;
        }
        return activeProvider.getTodaySteps();
    }

    public synchronized void sampleOnce(Runnable onComplete) {
        if (activeProvider == null) {
            if (onComplete != null) {
                onComplete.run();
            }
            return;
        }
        activeProvider.sampleOnce(onComplete);
    }

    public void requestPermission(Activity activity, int requestCode) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (activity.checkSelfPermission(Manifest.permission.ACTIVITY_RECOGNITION) != PackageManager.PERMISSION_GRANTED) {
                activity.requestPermissions(new String[]{Manifest.permission.ACTIVITY_RECOGNITION}, requestCode);
            }
        }
    }
}

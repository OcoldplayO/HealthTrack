package com.healthtrack.app.step;

/**
 * 步数数据源统一抽象接口。
 * 当前用于手机硬件计步器（PhoneSensorStepProvider），未来可无缝平替或扩展为
 * 智能手表/健康中枢提供者（如 Google Health Connect）。
 */
public interface StepProvider {
    interface StepUpdateListener {
        void onStepsUpdated(int todaySteps);
    }

    /**
     * 获取今天截至目前的步数
     * @return 今日步数；若传感器不可用或尚未初始化则返回 -1
     */
    int getTodaySteps();

    /**
     * 传感器或健康服务硬件/功能是否可用
     */
    boolean isAvailable();

    /**
     * 是否已获得系统必要权限
     */
    boolean hasPermission();

    /**
     * 前台激活监听
     */
    void start();

    /**
     * 后台暂停监听
     */
    void stop();

    /**
     * 注册实时步数变化回调
     */
    default void setUpdateListener(StepUpdateListener listener) {}

    /**
     * 触发单次常规采样（用于周期快照、关机前刷盘等）
     */
    default void sampleOnce(Runnable onComplete) {
        if (onComplete != null) {
            onComplete.run();
        }
    }

    /**
     * 触发每日零点基准采样（仅在零点窗口内强制重置今日基准）
     */
    default void sampleMidnightBaseline(Runnable onComplete) {
        sampleOnce(onComplete);
    }

    /**
     * 立即刷新硬件缓冲并获取最新步数
     */
    default void refreshNow(Runnable onComplete) {
        sampleOnce(onComplete);
    }

    /**
     * 获取当前计步状态诊断信息
     */
    default String getDebugInfo() {
        return "";
    }
}

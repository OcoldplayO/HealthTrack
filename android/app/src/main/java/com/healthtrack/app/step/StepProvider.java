package com.healthtrack.app.step;

/**
 * 步数数据源统一抽象接口。
 * 当前用于手机硬件计步器（PhoneSensorStepProvider），未来可无缝平替或扩展为
 * 智能手表/健康中枢提供者（如 Google Health Connect）。
 */
public interface StepProvider {
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
}

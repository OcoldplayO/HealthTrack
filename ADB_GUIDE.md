# ADB 连接速查（USB / 无线）

> 本机：adb 位于 `D:\AndroidDev\sdk\platform-tools\adb.exe`；手机无线地址 `XXX.xxxx.xxx.xxx:5555`。

## 一、USB 连接

```bash
adb devices -l          # 插线后确认设备，状态应为 device
```

- 手机需开启：开发者选项 → **USB 调试**；华为再加 **「仅充电模式下允许 ADB 调试」**。
- `device` = 正常；`unauthorized` = 手机点「允许 USB 调试」；`offline` = 拔插数据线。
- **连不上时的万能操作：重新拔插 USB + 在手机上关闭再打开「USB 调试」开关。**

## 二、切换无线（USB → WiFi）

```bash
adb devices -l                       # 先确认 USB 已连上
adb tcpip 5555                       # 打开 TCP 监听（必须在 USB 连接状态下执行）
adb connect XXX.xxxx.xxx.xxx:5555       # 无线连接
adb devices -l                       # 出现 XXX.xxxx.xxx.xxx:5555 device 即可拔线
```

## 三、手机重启后恢复

> 鸿蒙 4.0 / Android 10 **无原生「无线调试」**，重启后 adbd 退回 USB 模式，无线连接失效。

```bash
# 1) 先插一次数据线
adb devices -l
adb tcpip 5555
adb connect XXX.xxxx.xxx.xxx:5555
adb devices -l
# 2) 确认连上后拔线，继续无线使用
```

## 四、断开与重置

| 命令 | 作用 |
| :--- | :--- |
| `adb disconnect` | 断开**所有**无线（TCP/IP）设备，不影响 USB |
| `adb disconnect XXX.xxxx.xxx.xxx:5555` | 只断开指定无线设备 |
| `adb kill-server` | 结束 adb 本地服务进程（重置 adb） |
| `adb start-server` | 启动 adb 服务（多数命令会自动拉起，一般无需手动） |

```bash
# 同网下 adb connect 失败时的重置流程
adb kill-server
adb connect XXX.xxxx.xxx.xxx:5555
adb devices -l
```

## 五、命令说明

- `adb tcpip 5555`：让手机 adbd 监听 TCP 5555。**必须 USB 连接时执行**；手机重启/重新插拔后失效，需重做。
- `adb connect <ip>:5555`：按网络地址连接手机，端口省略默认 5555。成功后返回 `connected to ...`。
- `adb devices -l`：列出设备及详情（长格式含 `product/model/transport_id`）；状态为 `device` / `unauthorized` / `offline`。
- `adb disconnect [<ip>:5555]`：断开无线连接，不带参数断开全部无线设备。

## 六、排错

1. **`cannot connect ... 由于目标计算机积极拒绝 (10061)`**
   手机 5555 端口未监听：说明没执行过 `adb tcpip 5555`，或手机重启后失效。按「三」插线重做。**不是防火墙问题。**
2. **`adb devices` 为空（插着 USB 也看不到设备）**
   - 华为 **HiSuite 走的是 HDB 协议不是 ADB**，运行时会独占设备并切到 HDB 模式，导致 adb 看不到手机 → **彻底退出 HiSuite（含托盘/后台进程）**；
   - 确认「仅充电模式下允许 ADB 调试」已开；
   - **重新拔插 USB + 手机上关闭再打开「USB 调试」开关**（实测有效）；
   - 仍不行：换 USB 口 / 换数据线（部分线只供电），或装 Google USB Driver / 华为 ADB 驱动。
3. **`unauthorized`**：解锁手机点「允许」；不行就「撤销 USB 调试授权」后重连。
4. **IP 变了**：路由器 DHCP 重分配导致，重连前先确认手机当前 IP。
5. **多设备**：用 `adb -s <serial>` 指定目标设备（serial 见 `adb devices -l`）。

## 七、本机一键恢复（最省事）

```powershell
.\scripts\build-android.ps1
```

脚本会自动 `adb connect`；仍失败会提示需插线执行 `adb tcpip 5555`。

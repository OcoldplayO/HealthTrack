// Package netutil 提供运行环境相关的网络配置修正。
package netutil

import (
	"context"
	"fmt"
	"net"
	"runtime"
	"time"
)

// androidFallbackDNS 为 Android 上的纯 Go 解析器提供备选 DNS 服务器（阿里/腾讯/Google），
// 按顺序尝试，前者不可达时自动切换。
var androidFallbackDNS = []string{
	"223.5.5.5:53",
	"119.29.29.29:53",
	"8.8.8.8:53",
}

// ConfigureResolver 修正 Android 环境下域名无法解析的问题。
//
// Android 的 bionic 不维护 /etc/resolv.conf，而 APK 内以 CGO_ENABLED=0 编译的纯 Go
// 解析器只会从该文件读取 DNS 服务器，因此任何域名解析都会失败，表现为 AI 接口
// 返回 502（连接失败）。这里显式注入公共 DNS；桌面系统沿用系统配置，不做改动。
func ConfigureResolver() {
	if runtime.GOOS != "android" {
		return
	}

	net.DefaultResolver = &net.Resolver{
		PreferGo: true,
		Dial: func(ctx context.Context, network, _ string) (net.Conn, error) {
			var lastErr error
			for _, server := range androidFallbackDNS {
				dialer := net.Dialer{Timeout: 5 * time.Second}
				conn, err := dialer.DialContext(ctx, network, server)
				if err == nil {
					return conn, nil
				}
				lastErr = err
			}
			return nil, fmt.Errorf("所有备选 DNS 均不可达: %w", lastErr)
		},
	}
}

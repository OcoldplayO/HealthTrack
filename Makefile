.PHONY: run build-win build-linux test clean

# 本地直接运行
run:
	go run cmd/server/main.go

# 编译 Windows 64位单一可执行文件
build-win:
	@echo "正在编译 Windows 单一二进制文件..."
	go build -ldflags="-s -w" -o bin/healthtrack.exe cmd/server/main.go
	@echo "编译完成: bin/healthtrack.exe"

# 跨平台编译 Linux 64位独立可执行文件 (零 CGO 依赖，纯裸机可跑)
build-linux:
	@echo "正在交叉编译 Linux 独立二进制文件..."
	SET CGO_ENABLED=0
	SET GOOS=linux
	SET GOARCH=amd64
	go build -ldflags="-s -w" -o bin/healthtrack cmd/server/main.go
	@echo "编译完成: bin/healthtrack"

# 清理编译文件
clean:
	@if exist bin rmdir /s /q bin

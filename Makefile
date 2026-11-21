.PHONY: run build-ui typecheck test build-win build-linux clean

# 构建前端模块产物
build-ui:
	npm run build

# 前端静态类型检查
typecheck:
	npm run typecheck

# 全量校验与测试（前端 TS + Vitest + Go vet/test）
test:
	npm run typecheck
	npm test
	go vet ./...
	go test -count=1 ./...

# 本地直接运行
run: build-ui
	go run ./cmd/server

# 编译 Windows 64位单一可执行文件
build-win: build-ui
	@echo "正在编译 Windows 单一二进制文件..."
	go build -ldflags="-s -w" -o bin/healthtrack.exe ./cmd/server
	@echo "编译完成: bin/healthtrack.exe"

# 跨平台编译 Linux 64位独立可执行文件 (零 CGO 依赖，纯裸机可跑)
build-linux: build-ui
	@echo "正在交叉编译 Linux 独立二进制文件..."
ifeq ($(OS),Windows_NT)
	cmd /c "set CGO_ENABLED=0&& set GOOS=linux&& set GOARCH=amd64&& go build -ldflags=\"-s -w\" -o bin/healthtrack ./cmd/server"
else
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o bin/healthtrack ./cmd/server
endif
	@echo "编译完成: bin/healthtrack"

# 仅清理 bin 目录下的编译产物，绝对禁止触碰 data/ 目录
clean:
ifeq ($(OS),Windows_NT)
	@if exist bin\healthtrack.exe del /f /q bin\healthtrack.exe
	@if exist bin\healthtrack del /f /q bin\healthtrack
else
	rm -f bin/healthtrack.exe bin/healthtrack
endif

package web

import "embed"

// all: 使 static 下的子目录、以 . 或 _ 开头的资源也能被递归嵌入。
//
//go:embed all:static
var StaticFS embed.FS

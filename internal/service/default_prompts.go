package service

import (
	_ "embed"
)

//go:embed default_prompt.txt
var defaultPromptTemplate string

//go:embed default_evening_prompt.txt
var defaultEveningPromptTemplate string

//go:embed default_compare_prompt.txt
var defaultComparePromptTemplate string

// DefaultPrompt 返回内嵌的提示词模板，供磁盘模板缺失时兜底（例如 Android 端未打包 prompts 目录）。
func DefaultPrompt() string {
	return defaultPromptTemplate
}

// DefaultEveningPrompt 返回内嵌的睡前小结洞察模板，供磁盘模板缺失时兜底（例如 Android 端未打包 prompts 目录）。
func DefaultEveningPrompt() string {
	return defaultEveningPromptTemplate
}

// DefaultComparePrompt 返回内嵌的阶段对比模板，供磁盘模板缺失时兜底（例如 Android 端未打包 prompts 目录）。
func DefaultComparePrompt() string {
	return defaultComparePromptTemplate
}

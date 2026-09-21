package model

import "time"

const (
	CodeSuccess      = 200
	CodeParamError   = 40001
	CodeDateInvalid  = 40002
	CodeNotFound     = 40401
	CodeDBError      = 50001
	CodeAIServiceErr = 50201
)

type Response struct {
	Code      int    `json:"code"`
	Message   string `json:"message"`
	Data      any    `json:"data"`
	Timestamp int64  `json:"timestamp"`
}

func Success(data any) *Response {
	return &Response{
		Code:      CodeSuccess,
		Message:   "success",
		Data:      data,
		Timestamp: time.Now().Unix(),
	}
}

func SuccessWithMsg(msg string, data any) *Response {
	return &Response{
		Code:      CodeSuccess,
		Message:   msg,
		Data:      data,
		Timestamp: time.Now().Unix(),
	}
}

func Error(code int, msg string) *Response {
	return &Response{
		Code:      code,
		Message:   msg,
		Data:      nil,
		Timestamp: time.Now().Unix(),
	}
}

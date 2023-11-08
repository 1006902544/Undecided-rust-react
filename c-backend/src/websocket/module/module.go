package module

import wsFriendModule "c-backend/src/websocket/module/friend"

type Responder struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

type RequestParams[T wsFriendModule.FriendReqParams | interface{}] struct {
	Key  string `json:"key" binding:"required"`
	Data T      `json:"data"`
}

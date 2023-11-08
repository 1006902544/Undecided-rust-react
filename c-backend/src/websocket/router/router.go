package router

import (
	friendController "c-backend/src/websocket/controller/friend"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func Router(key string, conn *websocket.Conn, c *gin.Context) {
	routes := map[string]func(conn *websocket.Conn, c *gin.Context){
		"friend": friendController.GetFriendList,
	}

	value, ok := routes[key]
	if ok {
		value(conn, c)
	} else {

	}
}

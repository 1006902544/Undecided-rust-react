package friend

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func GetFriendList(ws *websocket.Conn, c *gin.Context) {
	ws.WriteJSON("friend")
}

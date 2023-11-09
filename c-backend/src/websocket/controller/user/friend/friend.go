package friend

import (
	wsModule "c-backend/src/websocket/module"
	wsFriendServer "c-backend/src/websocket/server/user/friend"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func GetFriendList(ws *websocket.Conn, c *gin.Context) {
	res, err := wsFriendServer.GetFriendList(1)
	if err != nil {
		res := wsModule.Responder{
			Code:    500,
			Message: err.Error(),
		}
		ws.WriteJSON(res)
	} else {
		res := wsModule.Responder{
			Code:    200,
			Message: "success",
			Data:    res,
		}
		ws.WriteJSON(res)
	}
}

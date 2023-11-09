package websocket

import (
	"errors"
	"fmt"
	"net/http"

	wsModule "c-backend/src/websocket/module"
	wsRouter "c-backend/src/websocket/router"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func Handler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println(err)
		conn.Close()
	}

	for {
		key, err := getKey(conn)
		if err != nil {
			conn.WriteJSON(wsModule.Responder{Code: 400, Message: err.Error()})
		} else {
			wsRouter.Router(key, conn, c)
		}
	}
}

func getKey(conn *websocket.Conn) (string, error) {
	var req = wsModule.RequestParams[interface{}]{}
	err := conn.ReadJSON(&req)
	if err != nil {
		return "", err
	} else {
		if req.Key == "" {
			return req.Key, errors.New("missing key 'key'")
		} else {
			return req.Key, err
		}
	}

}

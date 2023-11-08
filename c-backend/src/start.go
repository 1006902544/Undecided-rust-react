package start

import (
	"c-backend/src/lib/db"
	"c-backend/src/lib/middleware/errorHandler"
	basic "c-backend/src/router"
	ws "c-backend/src/websocket"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Start() {
	db.InitDb()

	r := gin.Default()
	r.Use(cors.Default())
	r.Use(errorHandler.RestfulError())

	r.GET("/ws", ws.Handler)
	basic.BasicRouter(r)

	r.Run(":8082")
}

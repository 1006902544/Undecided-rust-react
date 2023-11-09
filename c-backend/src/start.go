package start

import (
	"c-backend/src/lib/db"
	authorization "c-backend/src/lib/middleware/authorization"
	basic "c-backend/src/router"
	ws "c-backend/src/websocket"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Start() {
	db.InitDb()

	r := gin.Default()
	r.Use(cors.Default())
	r.Use(authorization.JWTAuth())

	r.GET("/ws", ws.Handler)
	basic.BasicRouter(r)

	r.Run(":8082")
}

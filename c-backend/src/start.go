package start

import (
	"c-backend/src/lib/db"
	authorization "c-backend/src/lib/middleware/authorization"
	cors "c-backend/src/lib/middleware/cors"
	basic "c-backend/src/router"
	ws "c-backend/src/websocket"

	"github.com/gin-gonic/gin"
)

func Start() {
	db.InitDb()

	r := gin.Default()
	r.Use(cors.Cors())
	r.Use(authorization.JWTAuth())

	r.GET("/ws", ws.Handler)
	basic.BasicRouter(r)

	r.Run(":8082")
}

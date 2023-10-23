package start

import (
	"c-backend/src/lib/db"
	"c-backend/src/lib/middleware/errorHandler"
	basic "c-backend/src/router"

	"github.com/gin-gonic/gin"
)

func Start() {

	r := gin.Default()
	r.Use(errorHandler.RestfulError())
	db.InitDb()

	basic.BasicRouter(r)

	r.Run(":8082")
}

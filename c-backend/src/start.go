package start

import (
	"c-endpoint/src/lib/db"
	basic "c-endpoint/src/router"

	"github.com/gin-gonic/gin"
)

func Start() {
	r := gin.Default()

	db.InitDb()

	basic.BasicRouter(r)
	r.Run(":8082")
}

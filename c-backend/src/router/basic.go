package basic

import (
	user "c-backend/src/router/user"

	"github.com/gin-gonic/gin"

	docs "c-backend/docs"

	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func BasicRouter(r *gin.Engine) {
	basic := "/api"

	docs.SwaggerInfo.BasePath = "/api"
	router := r.Group(basic)

	{
		router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
		user.UserRouter(router)
	}
}

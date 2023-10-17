package user

import "github.com/gin-gonic/gin"

func UserRouter(r *gin.RouterGroup) {
	router := r.Group("/user")

	{
		router.GET("", func(c *gin.Context) {

		})

	}
}

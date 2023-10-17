package basic

import (
	user "c-endpoint/src/router/user"

	"github.com/gin-gonic/gin"
)

func BasicRouter(r *gin.Engine) {
	basic := "/api"

	router := r.Group(basic)

	{
		user.UserRouter(router)
	}
}

package user

import (
	userController "c-backend/src/controller/user"
	captchaRouter "c-backend/src/router/user/captcha"

	"github.com/gin-gonic/gin"
)

func UserRouter(r *gin.RouterGroup) {
	router := r.Group("/user")

	{
		router.GET("", userController.SignUp)
	}

	captchaRouter.CaptchaRouter(router)
}

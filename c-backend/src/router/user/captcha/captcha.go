package captcha

import (
	"c-backend/src/controller/user/captcha"

	"github.com/gin-gonic/gin"
)

func CaptchaRouter(c *gin.RouterGroup) {
	router := c.Group("captcha")

	{
		router.POST("/send", captcha.SendCaptcha)
		router.POST("/verify", captcha.VerifyCaptcha)
	}
}

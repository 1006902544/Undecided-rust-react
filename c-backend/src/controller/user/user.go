package user

import (
	captcha "c-backend/src/lib/utils/captcha"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SignUp(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"aaa": captcha.CreateCaptcha(6)})
}

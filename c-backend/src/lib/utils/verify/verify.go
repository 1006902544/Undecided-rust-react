package verify

import (
	"c-backend/src/lib/utils/response"
	"strings"

	"github.com/gin-gonic/gin"
)

func VerifyJsonParams(c *gin.Context, obj interface{}, fn gin.HandlerFunc) {
	err := c.ShouldBindJSON(obj)
	if err == nil {
		fn(c)
	} else {
		response.BadRequest(c, strings.Split(err.Error(), "\n")[0])
	}
}

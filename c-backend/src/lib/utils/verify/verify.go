package verify

import (
	"c-backend/src/lib/utils/response"

	"github.com/gin-gonic/gin"
)

func VerifyJsonParams(c *gin.Context, obj any, fn gin.HandlerFunc) {
	err := c.ShouldBindJSON(obj)
	if err == nil {
		fn(c)
	} else {
		response.BadRequest(c, err.Error())
	}
}

package errorHandler

import (
	"github.com/gin-gonic/gin"
)

func RestfulError() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
	}
}

package authorization

import (
	authorizationHandle "c-backend/src/lib/authorization"
	"c-backend/src/lib/utils/response"

	"github.com/gin-gonic/gin"
)

type IncludePathMethod = string

const (
	GET    IncludePathMethod = "GET"
	POST   IncludePathMethod = "POST"
	DELETE IncludePathMethod = "DELETE"
)

type IncludePath struct {
	Path   string
	Method IncludePathMethod
}

var Includes = []IncludePath{}

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {

		if NeedAuth(c) {
			token := c.Request.Header.Get("Authorization")

			if token == "" {
				response.Unauthorized(c)
				c.Abort()
				return
			}

			_, err := authorizationHandle.DecodeToken(token)

			if err != nil {
				response.Unauthorized(c)
				c.Abort()
				return
			} else {

				c.Next()
			}
		} else {
			c.Next()
		}

	}
}

func NeedAuth(c *gin.Context) bool {
	method := c.Request.Method
	path := c.Request.URL.Path

	need := false

	for _, value := range Includes {
		if value.Method == method && value.Path == path {
			need = true
			break
		}
	}
	return need
}

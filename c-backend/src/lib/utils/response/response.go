package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type RestfulResponse struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func New(code int, message string, data interface{}) RestfulResponse {
	return RestfulResponse{
		code, message, data,
	}
}

func Success(c *gin.Context, data interface{}) {
	Send(c, New(http.StatusOK, "success", data))
}

func NotFoundError() RestfulResponse {
	return New(http.StatusNotFound, "Not found", nil)
}

func Notfound(c *gin.Context) {
	Send(c, NotFoundError())
}

func SqlError(msg string) RestfulResponse {
	return New(http.StatusForbidden, msg, nil)
}

func Forbidden(c *gin.Context, message string) {
	Send(c, New(http.StatusForbidden, message, nil))
}

func Send(c *gin.Context, res RestfulResponse) {
	c.JSON(res.Code, res)
}

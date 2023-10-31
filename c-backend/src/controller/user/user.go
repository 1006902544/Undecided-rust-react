package user

import (
	"c-backend/src/lib/utils/response"
	"c-backend/src/lib/utils/verify"
	userModule "c-backend/src/module/user"
	userServer "c-backend/src/server/user"

	"github.com/gin-gonic/gin"
)

// @Summary SignUp
// @Schemes
// @Tags User
// @Accept json
// @Produce json
// @Success 200 {object} response.RestfulResponse{data=string} "ok"
// @Param request body userModule.UserSignUpReq true "body"
// @Router /api/user/signUp [post]
func SignUp(c *gin.Context) {
	var data userModule.UserSignUpReq
	verify.VerifyJsonParams(c, &data, func(c *gin.Context) {
		switch data.Type {
		case userModule.Account:
			res := userServer.CreateAccount(data.Account)
			response.Send(c, res)
		default:
			response.BadRequest(c, "Type should be account or info")
		}
	})
}

package user

import (
	"c-backend/src/lib/authorization"
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

		case userModule.Info:
			res := userServer.CreateOrUpdateInfo(data.Info)
			response.Send(c, res)

		default:
			response.BadRequest(c, "Type should be account or info")
		}
	})
}

// @Summary SignIn
// @Schemas
// @Tags User
// @Accept json
// @Produce json
// @Success 200 {object} response.RestfulResponse{data=string} "ok"
// @Param request body userModule.SignInReq true "body"
// @Router /api/user/signIn [post]
func SignIn(c *gin.Context) {
	var data userModule.SignInReq
	verify.VerifyJsonParams(c, &data, func(c *gin.Context) {

		err := data.Validate()
		if err != nil {
			response.BadRequest(c, err.Error())
			return
		}

		switch data.Type {
		case "email":
			res := userServer.SignInByEmail(data.Email, data.Captcha)
			response.Send(c, res)

		case "password":
			res := userServer.SignInByPassword(data.Username, data.Password)
			response.Send(c, res)

		default:
			response.BadRequest(c, "type must be 'email' or 'password'")
		}
	})
}

// @Summary GetSelfInfo
// @Schemas
// @Tags User
// @Accept json
// @Produce json
// @Success 200 {object} response.RestfulResponse{data=userModule.UserInfo} "ok"
// @Router /api/user/self [get]
func GetSelfInfo(c *gin.Context) {
	token := c.Request.Header.Get("Authorization")
	if token == "" {
		response.Unauthorized(c)
	} else {
		res, err := authorization.DecodeToken(token)
		if err != nil {
			response.Unauthorized(c)
		} else {
			response.Success(c, res)
		}
	}
}

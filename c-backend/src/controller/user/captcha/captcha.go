package captcha

import (
	captchaUtil "c-backend/src/lib/utils/captcha"
	response "c-backend/src/lib/utils/response"
	"c-backend/src/lib/utils/verify"
	captchaModule "c-backend/src/module/user/captcha"
	captchaServer "c-backend/src/server/user/captcha"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Send captcha to email
// @Summary SendCaptchaToEmail
// @Schemes
// @Tags User
// @Accept json
// @Produce json
// @Success 200 {object} response.RestfulResponse "ok"
// @Param request body captchaModule.SendCaptchaReq true "body"
// @Router /api/user/captcha/send [post]
func SendCaptcha(c *gin.Context) {
	var data captchaModule.SendCaptchaReq
	verify.VerifyJsonParams(c, &data, func(c *gin.Context) {
		captcha := captchaUtil.CreateCaptcha(6)
		res := captchaServer.SendCaptcha(data.Email, captcha)
		if res.Code == http.StatusOK {
			err := captchaUtil.SendCaptcha(data.Email, captcha)
			if err == nil {
				response.Send(c, res)
			} else {
				response.Forbidden(c, err.Error())
			}
		} else {
			response.Send(c, res)
		}
	})
}

// Verify captcha to email
// @Summary EmailVerify
// @Schemes
// @Tags User
// @Accept json
// @Produce json
// @Success 200 {object} response.RestfulResponse "ok"
// @Param request body captchaModule.VerifyCaptchaReq true "body"
// @Router /api/user/captcha/verify [post]
func VerifyCaptcha(c *gin.Context) {
	var data captchaModule.VerifyCaptchaReq
	verify.VerifyJsonParams(c, &data, func(c *gin.Context) {
		response.Send(c, captchaServer.VerifyCaptcha(data))
	})
}

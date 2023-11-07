package user

import (
	"c-backend/src/lib/db"
	"c-backend/src/lib/utils/response"
	userModule "c-backend/src/module/user"
	captchaModule "c-backend/src/module/user/captcha"
	captchaServer "c-backend/src/server/user/captcha"
	"net/http"

	"gorm.io/gorm/clause"
)

func CreateAccount(data userModule.UserSignUpAccountReq) response.RestfulResponse {
	captchaRes := captchaServer.VerifyCaptcha(captchaModule.VerifyCaptchaReq{
		Email:   data.Email,
		Captcha: data.Captcha,
	})
	if captchaRes.Code == 200 {
		res := db.DB.Create(&userModule.UserAccountInfo{
			Username: data.Username,
			Password: data.Password,
			Email:    data.Email,
		})
		err := res.Error
		if err == nil {
			return response.SqlError(err.Error())
		} else {
			affect := res.RowsAffected
			if affect == 0 {
				return response.New(http.StatusBadRequest, "Create account failed", nil)
			} else {
				return response.New(http.StatusOK, "Create account success", nil)
			}
		}
	} else {
		return response.New(http.StatusNotFound, "Captcha is wrong or expired", nil)
	}
}

func CreateOrUpdateInfo(data userModule.UserCreateOrUpdateInfoReq) response.RestfulResponse {
	res := db.DB.Clauses((clause.OnConflict{UpdateAll: true})).Create(&userModule.UserInfo{
		Id:        data.Id,
		Nickname:  data.Nickname,
		Username:  data.Username,
		Gender:    data.Gender,
		Birthday:  data.Birthday,
		AvatarUrl: data.AvatarUrl,
		Mobile:    data.Mobile,
		Region:    data.Region,
		Email:     data.Email,
	})
	err := res.Error
	if err != nil {
		return response.SqlError(err.Error())
	} else {
		return response.New(http.StatusOK, "Handle success", nil)
	}
}

package user

import (
	"c-backend/src/lib/authorization"
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

func SignInByEmail(email string, captcha string) response.RestfulResponse {
	captchaRes := captchaServer.VerifyCaptcha(captchaModule.VerifyCaptchaReq{
		Email:   email,
		Captcha: captcha,
	})
	var user userModule.UserInfo
	if captchaRes.Code == 200 {
		res := db.DB.Where("email = ?", email).First(&user)

		if res.RowsAffected == 0 {
			return response.NotFoundError()
		}

		token, tokenErr := authorization.EncodeToken(user)
		if tokenErr != nil {
			return response.New(http.StatusUnauthorized, "encode failed", nil)
		}

		return response.New(200, "success", token)
	} else {
		return response.New(http.StatusBadRequest, "captcha is wrong", nil)
	}
}

func SignInByPassword(username string, password string) response.RestfulResponse {
	var user userModule.UserInfo
	res := db.DB.Table("user_account as ua").Select("ui.*").Where("ua.username = ? and ua.password = ?", username, password).Limit(1).Joins("left join user_info as ui on ui.id = ua.id").Scan(&user)

	if res.Error != nil {
		return response.SqlError(res.Error.Error())
	}

	if res.RowsAffected == 0 {
		return response.NotFoundError()
	}

	token, tokenErr := authorization.EncodeToken(user)

	if tokenErr != nil {
		return response.New(http.StatusUnauthorized, "encode failed", nil)
	}

	return response.New(200, "success", token)
}

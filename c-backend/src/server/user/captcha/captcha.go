package captcha

import (
	"c-backend/src/lib/db"
	response "c-backend/src/lib/utils/response"
	captchaModule "c-backend/src/module/user/captcha"
	"errors"
	"fmt"
	"net/http"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func SendCaptcha(email string, captcha string) response.RestfulResponse {
	var first captchaModule.Captcha
	res := db.DB.Where("email = ?", email).First(&first)
	if errors.Is(res.Error, gorm.ErrRecordNotFound) {
		return CreateOrUpdateCaptcha(email, captcha)
	} else {
		if first.UpdateTime.After(time.Now().Add(-1 * time.Minute)) {
			return response.New(403, "Please try latter", nil)
		} else {
			return CreateOrUpdateCaptcha(email, captcha)
		}
	}
}

func CreateOrUpdateCaptcha(email string, captcha string) response.RestfulResponse {
	row := captchaModule.Captcha{
		Email: email, Captcha: captcha, UpdateTime: time.Now(),
	}
	res := db.DB.Clauses(clause.OnConflict{UpdateAll: true}).Create(&row)
	err := res.Error
	if err != nil {
		return response.SqlError(err.Error())
	} else {
		return response.New(200, "Send success", nil)
	}
}

func VerifyCaptcha(data captchaModule.VerifyCaptchaReq) response.RestfulResponse {
	var first captchaModule.Captcha
	if err := db.DB.Where("email = ? and captcha = ?", data.Email, data.Captcha).First(&first).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return response.New(http.StatusNotFound, "Verify failed", nil)
		} else {
			return response.SqlError(err.Error())
		}
	} else {
		fmt.Println(first)
		return response.New(http.StatusOK, "Success", nil)
	}
}

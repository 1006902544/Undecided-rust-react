package captcha

import (
	"time"
)

type Captcha struct {
	Email      string    `json:"email"`
	Captcha    string    `json:"captcha"`
	UpdateTime time.Time `json:"updateTime" gorm:"column:update_time"`
}

func (Captcha) TableName() string {
	return "email_verify"
}

type SendCaptchaReq struct {
	Email string `json:"email" binding:"required,email"`
}

type VerifyCaptchaReq struct {
	Email   string `json:"email" binding:"required,email"`
	Captcha string `json:"captcha" binding:"required,len=6"`
}

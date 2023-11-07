package user

import (
	"time"
)

const (
	None    = "none"
	Account = "account"
	Info    = "info"
)

// 用户注册参数
type UserSignUpReq struct {
	Type    string                    `json:"type" binding:"required"`
	Account UserSignUpAccountReq      `json:"account" `
	Info    UserCreateOrUpdateInfoReq `json:"info"`
}

// 用户注册参数-账号
type UserSignUpAccountReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email" binding:"email"`
	Captcha  string `json:"captcha" binding:"len=6"`
}

// 用户注册参数-信息
type UserCreateOrUpdateInfoReq struct {
	Id        int       `json:"id"`
	Nickname  string    `json:"nickname"`
	Username  string    `json:"username"`
	Gender    int       `json:"gender"`
	Birthday  time.Time `json:"birthday"`
	AvatarUrl string    `json:"avatarUrl" gorm:"column:avatar_url"`
	Mobile    int       `json:"mobile"`
	Region    string    `json:"region"`
	Email     string    `json:"email" binding:"email"`
}

// 用户账号-表
type UserAccountInfo struct {
	Id       int    `json:"id" binding:"required"`
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
}

func (UserAccountInfo) TableName() string {
	return "user_account"
}

// 用户信息-表
type UserInfo struct {
	Id         int       `json:"id" binding:"required"`
	Nickname   string    `json:"nickname" binding:"required"`
	Username   string    `json:"username" binding:"required"`
	Gender     int       `json:"gender"`
	Birthday   time.Time `json:"birthday"`
	AvatarUrl  string    `json:"avatarUrl" gorm:"column:avatar_url"`
	CreateTime time.Time `json:"createTime" gorm:"column:create_time"`
	UpdateTime time.Time `json:"updateTime" gorm:"column:update_time"`
	Mobile     int       `json:"mobile"`
	Region     string    `json:"region" binding:"required"`
	Email      string    `json:"email" binding:"required,email"`
}

func (UserInfo) TableName() string {
	return "user_info"
}

// 用户登录参数
type SignInReq struct {
	Type     string `json:"type" binding:"required"`
	Username string `json:"username"  binding:"min=8,max=18"`
	Password string `json:"password" binding:"min=8,max=18"`
	Email    string `json:"email" binding:"email"`
	Captcha  string `json:"captcha" binding:"len=6"`
}

type UserInfoWithType struct {
	Type string `json:"type" binding:"required"`
	UserInfo
}

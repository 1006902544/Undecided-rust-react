package user

type SendCaptcha struct {
	Email string `json:"email" binding:"required,email"`
}

type SignUp struct {
}

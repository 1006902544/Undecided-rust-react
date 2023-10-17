package authorization

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type UserInfo struct {
	Id       int    `json:"id"`
	Username string `json:"username" validate:"min=10"`
	Email    string `json:"email"`
}

type MyCustomClaims struct {
	Foo string `json:"foo"`
	jwt.RegisteredClaims
	info UserInfo
}

func EncodeToken(info UserInfo) (string, error) {
	claims := MyCustomClaims{
		"bar",
		jwt.RegisteredClaims{
			Issuer:    "test",
			Subject:   "ginTestAuth",
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
		},
		info,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	mySigningKey := []byte("AllYourBase")

	ss, err := token.SignedString(mySigningKey)
	return ss, err
}

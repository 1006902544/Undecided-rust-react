package authorization

import (
	"errors"
	"time"

	userModule "c-backend/src/module/user"

	"github.com/golang-jwt/jwt/v5"
)

type MyCustomClaims struct {
	jwt.RegisteredClaims
	Info userModule.UserInfo
}

const signingKey = "secretKey"

func EncodeToken(info userModule.UserInfo) (string, error) {

	claims := MyCustomClaims{
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // 过期时间24小时
			IssuedAt:  jwt.NewNumericDate(time.Now()),                     // 签发时间
			NotBefore: jwt.NewNumericDate(time.Now()),                     // 生效时间
		},
		info,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	ss, err := token.SignedString([]byte(signingKey))
	return ss, err
}

func DecodeToken(token string) (*MyCustomClaims, error) {
	data, err := jwt.ParseWithClaims(token, &MyCustomClaims{}, func(t *jwt.Token) (interface{}, error) {

		return []byte(signingKey), nil
	})

	if err != nil {
		return nil, err
	}

	if !data.Valid {
		return nil, errors.New("claim invalid")
	}

	claims, ok := data.Claims.(*MyCustomClaims)

	if !ok {
		return nil, errors.New("invalid claim type")
	}

	if claims.Info.Id == 0 {
		return nil, errors.New("token is wrong")
	}

	return claims, nil
}

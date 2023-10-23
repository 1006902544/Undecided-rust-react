package captcha

import (
	"fmt"
	"math/rand"
	"strings"

	"gopkg.in/gomail.v2"
)

var chars = []string{
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	"1", "2", "3", "4", "5", "6", "7", "8", "9", "0"}

func CreateCaptcha(length int) string {
	str := strings.Builder{}
	charLength := len(chars)
	for i := 0; i < length; i++ {
		l := chars[rand.Intn(charLength)]
		str.WriteString(l)
	}
	return str.String()
}

func SendCaptcha(email string, captcha string) error {
	username := "1006902544@qq.com"
	from := fmt.Sprintf("<%s>", username)
	to := fmt.Sprintf("<%s>", email)
	host := "smtp.qq.com"
	port := 25
	password := "xfwprpiaxbugbcei"
	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", "captcha")
	m.SetBody("text/html", fmt.Sprintf("<p>Your captcha is : </p> <h2>%s</h2>", captcha))
	dialer := gomail.NewDialer(
		host,
		port,
		username,
		password,
	)
	return dialer.DialAndSend(m)
}

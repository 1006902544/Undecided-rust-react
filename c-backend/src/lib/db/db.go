package db

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDb() {
	dsn := "root:123456@tcp(127.0.0.1:3306)/actix_project?charset=utf8mb4&parseTime=true&loc=Local"
	cur_db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err == nil {
		DB = cur_db
	} else {
		panic(err.Error())
	}
}

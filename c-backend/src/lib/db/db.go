package db

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func InitDb() {
	dsn := "root:123456@tcp(127.0.0.1:3306)/actix_project?charset=utf8mb4"
	cur_db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err == nil {
		db = cur_db
	} else {
		panic(err.Error())
	}
}

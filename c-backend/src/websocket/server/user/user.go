package user

import (
	"c-backend/src/lib/db"
	wsUserModule "c-backend/src/websocket/module/user"
)

func UserOnline(id int) (string, error) {
	user := wsUserModule.UserOnlineStatus{
		Id: id,
	}
	err := db.DB.First(&user)
	if err != nil {
		return "error", err.Error
	} else {
		user.Status = 1
		err := db.DB.Save(&user)
		if err != nil {
			return "error", err.Error
		} else {
			return "success", nil
		}
	}
}

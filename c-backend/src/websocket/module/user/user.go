package user

import "time"

type UserOnlineStatus struct {
	Id             int       `json:"id"`
	Status         int       `json:"status"`
	LastHandleTime time.Time `json:"lastHandleTime" gorm:"column:last_handle_time"`
}

func (u UserOnlineStatus) TableName() string {
	return "user_online_status"
}

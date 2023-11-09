package friend

import (
	userModule "c-backend/src/module/user"
	"time"
)

type Friend struct {
	userModule.UserInfo
	Status         int       `json:"status"`
	LastHandleTime time.Time `json:"lastHandleTime" gorm:"column:last_handle_time"`
}

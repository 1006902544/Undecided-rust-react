package friend

import (
	"c-backend/src/lib/db"
	friendModule "c-backend/src/module/user/friend"
)

func GetFriendList(id int) ([]friendModule.Friend, error) {
	var friends = []friendModule.Friend{}
	err := db.DB.Table("friends").Select("ui.*,uos.status,uos.last_handle_time").Joins("left join user_info as ui on ui.id=friends.user_id").Joins("left join user_online_status as uos on uos.id=friends.user_id").Scan(&friends)
	return friends, err.Error
}

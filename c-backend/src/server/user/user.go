package user

import (
	"c-backend/src/lib/db"
	"c-backend/src/lib/utils/response"
	userModule "c-backend/src/module/user"
	"net/http"
)

func CreateAccount(data userModule.UserSignUpAccountReq) response.RestfulResponse {
	res := db.DB.Create(&data)
	err := res.Error
	if err == nil {
		return response.SqlError(err.Error())
	} else {
		affect := res.RowsAffected
		if affect == 0 {
			return response.New(http.StatusBadRequest, "Create account failed", nil)
		} else {
			return response.New(http.StatusOK, "Create account success", nil)
		}
	}
}

func CreateOrUpdateInfo(data userModule.UserCreateOrUpdateInfoReq) {

}

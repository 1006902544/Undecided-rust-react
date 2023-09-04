use mysql_common::prelude::FromRow;
use serde::*;
use validator::Validate;

#[derive(Debug, Clone, Deserialize, Serialize, FromRow, Validate)]
pub struct UserSignUpReq {
    #[validate(length(min = 6, max = 18))]
    pub username: String,
    #[validate(length(min = 6, max = 18))]
    pub password: String,
}

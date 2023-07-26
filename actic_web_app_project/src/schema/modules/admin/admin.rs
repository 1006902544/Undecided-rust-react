use mysql::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

// 用户信息
#[derive(Serialize, Deserialize, Debug, Clone, FromRow, ToSchema)]
pub struct AdminInfo {
    pub id: u128,
    pub name: String,
    pub age: u8,
    pub status: i8,
    pub gender: i8,
    pub create_time: String,
    pub update_time: String,
    pub username: String,
    pub level: u8,
}

//登录req
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct LoginBody {
    pub username: String,
    pub password: String,
}

//注册请求
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct SignUpReq {
    pub username: String,
    pub password: String,
    pub name: String,
    pub age: u8,
    pub gender: Option<u8>,
}

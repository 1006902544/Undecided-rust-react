use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::*;
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

#[derive(Debug, Clone, Deserialize, Serialize, Validate, ToSchema, FromRow)]
pub struct User {
    pub id: u64,
    pub nickname: String,
    pub username: String,
    pub gender: u8,
    #[schema(value_type = String)]
    pub birthday: NaiveDateTime,
    pub is_banned: u64,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
    pub avatar_url: String,
}

#[derive(Debug, Clone, Deserialize, Serialize, Validate, ToSchema, FromRow)]
pub struct UserDetail {
    pub id: u64,
    pub nickname: String,
    pub username: String,
    pub gender: u8,
    #[schema(value_type = String)]
    pub birthday: NaiveDateTime,
    pub is_banned: u64,
    pub banned_date: Option<u32>,
    #[schema(value_type = String)]
    pub banned_start_time: Option<NaiveDateTime>,
    pub banned_reason: Option<String>,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
    pub avatar_url: String,
    pub region: String,
    pub email: String,
    pub mobile: String,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct GetUserDetailReq {
    pub id: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize, Validate, ToSchema)]
pub struct BannedUser {
    pub id: u64,
    pub date: u32,
    pub reason: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize, Validate, ToSchema, IntoParams)]
pub struct UnblockUser {
    pub id: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize, Validate, ToSchema, IntoParams)]
pub struct GetUserLimitReq {
    pub id: Option<String>,
    pub username: Option<String>,
    pub nickname: Option<String>,
    pub gender: Option<u8>,
    pub limit: Option<u64>,
    pub page: Option<u64>,
}

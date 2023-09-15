pub mod captcha;
pub mod role_audit;
use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

#[derive(Debug, Clone, ToSchema, FromRow, Serialize, Deserialize)]
pub struct ManagerInfo {
    pub id: u64,
    pub username: String,
    pub email: String,
    pub name: Option<String>,
    pub avatar: Option<String>,
    pub gender: Option<u64>,
    pub age: Option<u64>,
    pub mobile: Option<String>,
    pub role_id: Option<u64>,
    pub role_name: Option<String>,
    #[schema(value_type = Option<String>)]
    pub create_time: Option<NaiveDateTime>,
    #[schema(value_type = Option<String>)]
    pub update_time: Option<NaiveDateTime>,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, IntoParams)]
pub struct GetManagerInfoReq {
    pub id: u64,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, Validate)]
pub struct ManagerSignupAccount {
    #[validate(length(min = 6, max = 18))]
    pub username: String,
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 6, max = 18))]
    pub password: String,
    pub captcha: String,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, Validate)]
pub struct ManagerInfoUpdate {
    pub name: String,
    #[validate(url)]
    pub avatar: Option<String>,
    pub gender: Option<u64>,
    pub age: Option<u8>,
    #[validate(length(equal = 11), required)]
    pub mobile: Option<String>,
    pub username: String,
    pub email: String,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, Validate)]
pub struct ManagerSignIn {
    #[validate(length(min = 6, max = 18), required)]
    pub username: Option<String>,
    #[validate(length(min = 6, max = 18), required)]
    pub password: Option<String>,

    #[validate(email, required)]
    pub email: Option<String>,
    #[validate(length(equal = 6), required)]
    pub captcha: Option<String>,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, IntoParams)]
pub struct ManagerInfoLimitReq {
    pub limit: Option<u64>,
    pub page: Option<u64>,
    pub id: Option<u64>,
    pub username: Option<String>,
    pub name: Option<String>,
    pub gender: Option<u8>,
    pub role_id: Option<u8>,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, IntoParams)]
pub struct DeleteManager {
    pub id: u64,
}

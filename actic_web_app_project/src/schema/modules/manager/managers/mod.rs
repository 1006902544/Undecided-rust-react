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
    pub name: String,
    pub avatar: Option<String>,
    pub gender: u64,
    pub age: Option<u64>,
    pub mobile: Option<String>,
    pub role_id: u64,
    pub role_name: String,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, IntoParams)]
pub struct GetManagerInfoReq {
    pub id: u64,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, Validate)]
pub struct ManagerSignUpAccount {
    #[validate(length(min = 6, max = 18))]
    pub username: Option<String>,
    #[validate(email)]
    pub email: Option<String>,
    #[validate(length(min = 6, max = 18))]
    pub password: String,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, Validate)]
pub struct ManagerInfoUpdate {
    pub id: Option<u64>,
    pub name: String,
    #[validate(url)]
    pub avatar: Option<String>,
    pub gender: Option<u64>,
    pub age: Option<u8>,
    #[validate(length(equal = 11))]
    pub mobile: Option<String>,
    pub role_id: u64,
    pub role_name: String,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, Validate)]
pub struct ManagerSignIn {
    #[validate(length(min = 6, max = 18))]
    pub username: Option<String>,
    #[validate(email)]
    pub email: Option<String>,
    #[validate(length(min = 6, max = 18))]
    pub password: String,
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

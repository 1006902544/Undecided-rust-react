use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, FromRow)]
pub struct ManagerAvatarAuditRow {
    pub id: u64,
    pub avatar: String,
    pub name: String,
    pub username: String,
    pub status: u8,
    pub reason: Option<String>,
    #[schema(value_type=String)]
    pub update_time: NaiveDateTime,
    #[schema(value_type=String)]
    pub create_time: NaiveDateTime,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, IntoParams, Validate)]
pub struct ManagerAvatarLimitReq {
    pub status: Option<u8>,
    pub id: Option<u64>,
    pub name: Option<String>,
    pub username: Option<String>,
    pub limit: Option<u64>,
    pub page: Option<u64>,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, Validate)]
pub struct ManagerAvatarAuditReq {
    pub status: u8,
    pub id: u64,
    #[validate(length(max = 200, min = 0), required)]
    pub reason: Option<String>,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, IntoParams, Validate)]
pub struct ManagerAvatarAuditDeleteReq {
    pub id: u64,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, IntoParams, Validate)]
pub struct ManagerAvatarApplyReq {
    pub avatar: String,
}

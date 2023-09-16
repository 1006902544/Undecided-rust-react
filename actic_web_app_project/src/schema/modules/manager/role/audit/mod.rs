use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, FromRow)]
pub struct RoleAuditRow {
    pub id: u64,
    pub username: String,
    pub email: String,
    pub name: String,
    pub status: u8,
    pub role_id: u64,
    pub role_name: String,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, FromRow, IntoParams)]
pub struct RoleAuditLimitReq {
    pub id: Option<u64>,
    pub username: Option<String>,
    pub name: Option<String>,
    pub status: Option<u8>,
    pub role_id: Option<u64>,
    pub limit: Option<u64>,
    pub page: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ApplyRoleReq {
    pub role_id: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct RoleAuditReq {
    pub id: u64,
    ///0-waiting 1-pass 2-refused
    pub status: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, IntoParams)]
pub struct RoleAuditDeleteReq {
    pub id: u64,
}

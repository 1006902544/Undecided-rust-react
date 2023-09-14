use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, FromRow)]
pub struct ManagerRoleAudit {
    pub id: u64,
    pub name: String,
    pub username: String,
    pub email: String,
    ///0-disAudit 1-auditing 2-passed 3-refused
    pub status: String,
    pub role_id: String,
    pub role_name: String,
    #[schema(value_type=String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type=String)]
    pub update_time: NaiveDateTime,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, IntoParams)]
pub struct ManagerRoleAuditReq {
    pub id: Option<u64>,
    pub name: Option<String>,
    pub username: Option<String>,
    pub status: Option<u8>,
    pub role_id: String,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct ManagerRoleAuditCreate {
    pub id: Option<u64>,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct ManagerRoleAuditStatusUpdate {
    pub id: u64,
    ///0-disAudit 1-auditing 2-passed 3-refused
    pub status: u8,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, IntoParams)]
pub struct DeleteManagerRoleAudit {
    pub id: u64,
}

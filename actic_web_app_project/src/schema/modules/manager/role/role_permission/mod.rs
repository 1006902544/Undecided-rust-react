use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, FromRow)]
pub struct ManagerRolePermissionRow {
    pub id: u64,
    pub name: Option<String>,
    pub path: Option<String>,
    pub method: Option<String>,
    pub status: u8,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct ManagerRolePermissionRowReq {
    pub role_id: u64,
    pub limit: Option<u64>,
    pub page: Option<u64>,
    pub name: Option<String>,
    pub path: Option<String>,
    pub method: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema)]
pub struct ManagerRolePermissionStatusReq {
    pub permission_ids: Vec<u64>,
    pub role_id: u64,
    pub status: u8,
}

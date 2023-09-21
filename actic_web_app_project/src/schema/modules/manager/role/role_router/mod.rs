use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, ToSchema, Deserialize, Serialize, FromRow)]
pub struct ManagerRoleRouterRow {
    pub key: u64,
    pub label: String,
    pub path: String,
    pub sort: u64,
    pub status: u8,
}

#[derive(Debug, Clone, ToSchema, Deserialize, Serialize, IntoParams)]
pub struct ManagerRoleRouterReq {
    pub role_id: u64,

    pub router_key: Option<u64>,
    pub label: Option<String>,
    pub path: Option<String>,
    pub status: Option<u8>,

    pub limit: Option<u64>,
    pub page: Option<u64>,
}

#[derive(Debug, Clone, ToSchema, Deserialize, Serialize)]
pub struct ManagerRoleRouterStatusReq {
    pub role_id: u64,
    pub router_keys: Vec<u64>,
    pub status: u8,
}

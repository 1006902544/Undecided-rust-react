use mysql::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, Clone, ToSchema)]
pub struct UpdatePermissionBody {
    pub id: Option<u128>,
    pub name: String,
    pub path: Option<String>,
    pub method: Option<String>,
    pub remark: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, ToSchema, FromRow)]
pub struct Permission {
    pub id: u128,
    pub name: String,
    pub path: Option<String>,
    pub method: Option<String>,
    pub create_time: String,
    pub update_time: String,
    pub remark: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, ToSchema, FromRow)]
pub struct PermissionLimitQuery {
    pub id: Option<String>,
    pub name: Option<String>,
    pub path: Option<String>,
    pub method: Option<String>,
    pub limit: Option<String>,
    pub page: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, ToSchema)]
pub struct DeletePermissionQuery {
    pub id: String,
}

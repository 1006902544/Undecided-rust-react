use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, FromRow)]
pub struct ManagerRole {
    pub id: u64,
    pub name: String,
    pub icon: Option<String>,
    pub remark: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, FromRow, Validate)]
pub struct ManagerRoleUpdateReq {
    pub id: Option<u64>,
    #[validate(length(max = 50))]
    pub name: String,
    #[validate(url, required)]
    pub icon: Option<String>,
    #[validate(length(max = 200), required)]
    pub remark: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, IntoParams)]
pub struct ManagerRoleReq {
    pub id: Option<u64>,
    pub name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, IntoParams)]
pub struct ManagerRoleDeleteReq {
    pub id: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, FromRow)]
pub struct ManagerRoleList {
    pub value: u64,
    pub label: String,
}

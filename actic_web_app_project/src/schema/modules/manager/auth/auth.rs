use crate::schema::base_struct::*;
use mysql::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, Debug, Clone, FromRow, ToSchema)]
pub struct AuthLimitReq {
    pub limit: Option<String>,
    pub page: Option<String>,
    pub id: Option<String>,
    pub name: Option<String>,
}

#[derive(Debug)]
pub struct AuthLimitServiceReq {
    pub limit: u128,
    pub page: u128,
    pub id: Option<String>,
    pub name: Option<String>,
}

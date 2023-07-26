use mysql::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Deserialize, Serialize, ToSchema, FromRow)]
pub struct Route {
    pub key: Option<String>,
    pub label: String,
    pub path: String,
    pub p_key: Option<String>,
    pub level: u8,
    pub sort: u128,
}

#[derive(Debug, Deserialize, Serialize, ToSchema, FromRow)]
pub struct DeleteRouteQuery {
    pub key: String,
}

use chrono::NaiveDateTime;
use mysql::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, FromRow)]
pub struct Route {
    pub key: Option<u64>,
    pub label: String,
    pub path: String,
    pub p_key: Option<u64>,
    pub level: u64,
    pub sort: u64,
    pub public: u8,
    #[schema(value_type=String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type=String)]
    pub update_time: NaiveDateTime,
}

#[derive(Debug, Deserialize, Serialize, ToSchema, FromRow)]
pub struct DeleteRouteQuery {
    pub key: String,
}

#[derive(Debug, Deserialize, Serialize, ToSchema, FromRow)]
pub struct UpdateRouteReq {
    pub key: Option<u64>,
    pub label: String,
    pub path: String,
    pub p_key: Option<u64>,
    pub sort: u64,
    pub public: u8,
}

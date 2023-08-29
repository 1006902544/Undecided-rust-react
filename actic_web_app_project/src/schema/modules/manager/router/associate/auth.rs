use chrono::NaiveDateTime;
use mysql::prelude::*;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, ToSchema, Deserialize, Serialize, FromRow)]
pub struct AssociateRouterAuthLimitReq {
    pub rkey: String,
    pub limit: Option<String>,
    pub page: Option<String>,
    pub id: Option<String>,
    pub name: Option<String>,
}

#[derive(Debug, ToSchema, Deserialize, Serialize, FromRow)]
pub struct AssociateRouterAuthLimit {
    pub id: u128,
    pub name: String,
    pub username: String,
    pub age: u128,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
    pub associated: u8,
}

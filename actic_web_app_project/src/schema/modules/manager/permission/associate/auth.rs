use mysql::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, ToSchema, Deserialize, Serialize, FromRow)]
pub struct AssociateAuthLimitReq {
    pub pid: String,
    pub limit: Option<String>,
    pub page: Option<String>,
    pub id: Option<String>,
    pub name: Option<String>,
}

#[derive(Debug, ToSchema, Deserialize, Serialize, FromRow)]
pub struct AssociateAuthLimit {
    pub id: u128,
    pub name: String,
    pub username: String,
    pub age: u128,
    pub create_time: String,
    pub update_time: String,
    ///1:associated  0:disassociated
    pub associated: u8,
}

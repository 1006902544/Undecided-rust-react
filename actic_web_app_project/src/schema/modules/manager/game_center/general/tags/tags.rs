use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, ToSchema, FromRow, Serialize, Deserialize)]
pub struct Tag {
    pub id: u128,
    pub name: String,
    pub description: Option<String>,
    pub bg_color: String,
    pub border_color: String,
    pub text_color: String,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
}

#[derive(Debug, ToSchema, Serialize, Deserialize)]
pub struct UpdateTagReq {
    pub id: Option<u128>,
    pub name: String,
    pub description: Option<String>,
    pub bg_color: String,
    pub border_color: String,
    pub text_color: String,
}

#[derive(Debug, ToSchema, Serialize, Deserialize, IntoParams)]
pub struct TagLimitReq {
    pub limit: Option<u64>,
    pub page: Option<u64>,
    pub id: Option<u64>,
    pub name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema, IntoParams, Clone)]
pub struct DeleteTagReq {
    pub id: u64,
}

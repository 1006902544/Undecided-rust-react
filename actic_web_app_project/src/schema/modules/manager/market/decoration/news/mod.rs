use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, FromRow)]
pub struct News {
    pub id: u64,
    pub title: String,
    pub content: String,
    pub sort: u64,
    #[schema(value_type=String)]
    pub update_time: NaiveDateTime,
    #[schema(value_type=String)]
    pub create_time: NaiveDateTime,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema)]
pub struct UpdateNewsReq {
    pub id: Option<u64>,
    pub title: String,
    pub content: String,
    pub sort: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct DeleteNewsReq {
    pub id: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct GetNewsReq {
    pub page: Option<u64>,
    pub limit: Option<u64>,
    pub title: Option<String>,
}

use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, FromRow)]
pub struct Sku {
    pub id: u64,
    pub name: String,
    pub spu_id: u64,
    pub spu_name: String,
    pub description: Option<String>,
    pub cover_url: String,
    pub cover_name: String,
    pub price: f64,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub issue_time: NaiveDateTime,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SkuUpdateReq {
    pub spu_id: String,
    pub spu_name: String,
    pub id: Option<String>,
    pub name: String,
    pub description: Option<String>,
    pub cover_url: String,
    pub cover_name: String,
    pub price: String,
    pub issue_time: String,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, IntoParams)]
pub struct SkuLimitReq {
    pub spu_id: Option<String>,
    pub spu_name: Option<String>,
    pub id: Option<String>,
    pub name: Option<String>,
    pub limit: Option<u64>,
    pub page: Option<u64>,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, IntoParams)]
pub struct SkuDeleteReq {
    pub id: String,
}

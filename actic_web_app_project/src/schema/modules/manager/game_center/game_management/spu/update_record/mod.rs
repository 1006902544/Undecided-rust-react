use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::*;
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, FromRow)]
pub struct SpuUpdateRecord {
    pub id: u64,
    pub spu_id: u64,
    pub spu_title: String,
    pub title: String,
    pub content: Option<String>,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, Validate)]
pub struct UpdateSpuUpdateRecord {
    pub id: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub title: String,
    pub spu_id: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub spu_name: Option<String>,
    pub content: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, Validate, IntoParams)]
pub struct SpuUpdateRecordLimitReq {
    pub id: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub title: Option<String>,
    pub spu_id: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub spu_name: Option<String>,
    pub limit: Option<u64>,
    pub page: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, IntoParams)]
pub struct SpuUpdateRecordDeleteReq {
    pub id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UpdateSpuUpdateRecordRes {
    pub id: Option<String>,
    pub title: Option<String>,
}

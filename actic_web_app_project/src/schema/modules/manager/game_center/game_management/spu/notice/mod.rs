use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::*;
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, FromRow)]
pub struct SpuNotice {
    pub id: u64,
    pub spu_id: u64,
    pub title: String,
    pub spu_name: String,
    pub content: String,
    pub publish_type: String,
    pub published: bool,
    #[schema(value_type = Option<String>)]
    pub publish_time: Option<NaiveDateTime>,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, IntoParams)]
pub struct SpuNoticeLimitReq {
    pub limit: Option<u64>,
    pub page: Option<u64>,
    pub id: Option<String>,
    pub publish_type: Option<String>,
    pub published: Option<u8>,
    pub spu_id: Option<String>,
    pub title: Option<String>,
    pub spu_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, Validate)]
pub struct SpuNoticeUpdateReq {
    pub id: Option<String>,
    pub spu_id: Option<String>,
    #[validate(length(min = 1, max = 100))]
    pub title: String,
    #[validate(length(min = 1, max = 100), required)]
    pub spu_name: Option<String>,
    pub content: Option<String>,
    pub publish_type: String,
    #[schema(value_type = Option<String>)]
    pub publish_time: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, IntoParams)]
pub struct SpuNoticeDeleteReq {
    pub id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct SpuNoticeUpdateRes {
    pub id: Option<String>,
    pub title: Option<String>,
}

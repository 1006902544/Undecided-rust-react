use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuLimit {
    pub id: u64,
    pub name: String,
    pub company_name: Option<String>,
    pub types: Vec<String>,
    pub cover: SpuFileObject,
    pub tags: Vec<String>,
    pub price: f64,
    #[schema(value_type = String)]
    pub issue_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuDetail {
    pub id: u64,
    pub name: String,
    pub company_id: Option<u64>,
    pub price: f64,
    pub cover: SpuFileObject,
    pub carousel: Vec<SpuFileObject>,
    pub tag_ids: Vec<String>,
    pub type_ids: Vec<String>,
    pub activity: u64,
    pub views: u64,
    pub acclaim: u64,
    pub bad_reviews: u64,
    pub description: Option<String>,
    #[schema(value_type = String)]
    pub issue_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, FromRow)]
pub struct SpuSqlDetail {
    pub id: u64,
    pub name: String,
    pub company_id: Option<u64>,
    pub price: f64,
    pub cover_url: String,
    pub cover_name: String,
    pub carousel: serde_json::Value,
    pub tag_ids: String,
    pub type_ids: String,
    pub activity: u64,
    pub views: u64,
    pub acclaim: u64,
    pub bad_reviews: u64,
    pub description: Option<String>,
    #[schema(value_type = String)]
    pub issue_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, Validate)]
pub struct UpdateSpuReq {
    pub id: Option<String>,
    #[validate(length(min = 1, max = 200))]
    pub name: String,
    pub company_id: Option<String>,
    pub price: u64,
    pub cover: SpuFileObject,
    pub carousel: Vec<SpuFileObject>,
    pub tag_ids: Vec<String>,
    pub type_ids: Vec<String>,
    pub description: Option<String>,
    pub issue_time: String,
}

#[derive(Debug, IntoParams, ToSchema, Deserialize, Serialize)]
pub struct GetSpuDetailReq {
    pub id: String,
}

#[derive(Debug, IntoParams, ToSchema, Deserialize, Serialize)]
pub struct DeleteSpuDetailReq {
    pub id: String,
}

#[derive(Debug, IntoParams, ToSchema, Serialize, Deserialize)]
pub struct GetSpuLimitReq {
    pub limit: Option<u64>,
    pub page: Option<u64>,
    pub id: Option<u64>,
    pub tag_ids: Option<u64>,
    pub type_ids: Option<u64>,
    pub name: Option<String>,
    pub start_price: Option<u64>,
    pub end_price: Option<u64>,
    pub start_issue_time: Option<String>,
    pub end_issue_time: Option<String>,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuFileObject {
    pub url: String,
    pub name: String,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuUpdateRes {
    pub id: Option<String>,
    pub name: Option<String>,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuSkuTree {
    pub spu_id: u64,
    pub spu_name: String,
    pub sku_id: Option<u64>,
    pub sku_name: Option<String>,
    pub price: f64,
    pub cover_url: String,
    pub children: Vec<SpuTreeChildren>,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuTreeChildren {
    pub spu_id: u64,
    pub spu_name: String,
    pub sku_id: Option<u64>,
    pub sku_name: Option<String>,
    pub price: f64,
    pub cover_url: String,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, IntoParams)]
pub struct GetSpuTreeReq {
    pub spu_id: Option<u64>,
    pub spu_name: Option<String>,
    pub limit: Option<u64>,
    pub page: Option<u64>,
}

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuLimit {
    pub id: u64,
    pub name: String,
    pub company: Option<String>,
    pub type_names: Vec<String>,
    pub cover: SpuFileObject,
    pub tag_names: Vec<String>,
    pub price: u64,
    #[schema(value_type = String)]
    pub issue_time: NaiveDate,
    #[schema(value_type = String)]
    pub create_time: NaiveDate,
    #[schema(value_type = String)]
    pub update_time: NaiveDate,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuDetail {
    pub id: u64,
    pub name: String,
    pub company_id: Option<u64>,
    pub price: u64,
    pub cover: SpuFileObject,
    pub carousel: Vec<SpuFileObject>,
    pub tag_ids: Vec<u64>,
    pub type_ids: Vec<u64>,
    pub activity: u64,
    pub views: u64,
    pub acclaim: u64,
    pub bad_reviews: u64,
    pub description: Option<String>,
    #[schema(value_type = String)]
    pub issue_time: NaiveDate,
    #[schema(value_type = String)]
    pub create_time: NaiveDate,
    #[schema(value_type = String)]
    pub update_time: NaiveDate,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, Validate)]
pub struct UpdateSpuReq {
    pub id: Option<u64>,
    #[validate(length(min = 1, max = 200))]
    pub name: String,
    pub company_id: Option<u64>,
    pub price: u64,
    pub cover: SpuFileObject,
    pub carousel: Vec<SpuFileObject>,
    pub tag_ids: Vec<u64>,
    pub type_ids: Vec<u64>,
    pub description: Option<String>,
    #[schema(value_type = String)]
    pub issue_time: NaiveDate,
}

#[derive(Debug, IntoParams, ToSchema)]
pub struct GetSpuDetailReq {
    pub id: u64,
}

#[derive(Debug, IntoParams, ToSchema)]
pub struct DeleteSpuDetailReq {
    pub id: u64,
}

#[derive(Debug, IntoParams, ToSchema)]
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
pub struct SpuTag {
    pub name: String,
    pub id: u64,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuType {
    pub name: String,
    pub id: String,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuCompany {
    pub name: String,
    pub id: String,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuFileObject {
    pub url: String,
    pub name: String,
}

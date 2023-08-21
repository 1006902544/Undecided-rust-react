use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct GameSPULimit {
    pub id: u64,
    pub name: String,
    pub company_name: String,
    pub type_names: Vec<String>,
    pub logo_url: String,
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
pub struct GameSPUDetail {
    pub id: u64,
    pub name: String,
    pub company: Option<SpuCompany>,
    pub price: u64,
    pub logo_url: String,
    pub e_tag: String,
    pub logo_name: String,
    pub tags: Vec<SpuTag>,
    pub types: Vec<SpuType>,
    pub description: Option<String>,
    #[schema(value_type = String)]
    pub issue_time: NaiveDate,
    #[schema(value_type = String)]
    pub create_time: NaiveDate,
    #[schema(value_type = String)]
    pub update_time: NaiveDate,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize, Validate)]
pub struct UpdateGameSpu {
    pub id: Option<u64>,
    #[validate(length(min = 1, max = 200))]
    pub name: String,
    pub company_ids: Option<u64>,
    pub price: u64,
    pub logo_url: String,
    pub e_tag: String,
    pub logo_name: String,
    pub tag_ids: Vec<u64>,
    pub type_ids: Vec<u64>,
    pub description: Option<String>,
    #[schema(value_type = String)]
    pub issue_time: NaiveDate,
}

#[derive(Debug, IntoParams, ToSchema)]
pub struct GetGameDetailReq {
    pub id: u64,
}

#[derive(Debug, IntoParams, ToSchema)]
pub struct DeleteGameDetailReq {
    pub id: u64,
}

#[derive(Debug, IntoParams, ToSchema)]
pub struct GetGameLimitReq {
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
    name: String,
    id: u64,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuType {
    name: String,
    id: String,
}

#[derive(Debug, Clone, ToSchema, Serialize, Deserialize)]
pub struct SpuCompany {
    name: String,
    id: String,
}

use chrono::NaiveDate;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

#[derive(Debug, ToSchema, FromRow, Validate, Deserialize, Serialize)]
pub struct CompanyStudio {
    pub id: u64,
    pub name: String,
    pub logo_url: String,
    #[schema(value_type = String)]
    pub update_time: NaiveDate,
    #[schema(value_type = String)]
    pub create_time: NaiveDate,
    #[schema(value_type = String)]
    pub established_time: NaiveDate,
}

#[derive(Debug, ToSchema, FromRow, Validate, Deserialize, Serialize)]
pub struct CompanyStudioDetail {
    pub id: u64,
    pub name: String,
    pub e_tag: String,
    pub logo_name: String,
    pub logo_url: String,
    pub description: Option<String>,
    #[validate(length(min = 0, max = 200), required)]
    pub region: Option<String>,
    #[validate(length(min = 0, max = 50), required)]
    pub founder: Option<String>,
    #[schema(value_type = String)]
    pub update_time: NaiveDate,
    #[schema(value_type = String)]
    pub create_time: NaiveDate,
    #[schema(value_type = String)]
    pub established_time: NaiveDate,
}

#[derive(Debug, ToSchema, FromRow, Validate, Deserialize, Serialize)]
pub struct UpdateCompanyStudioReq {
    pub id: Option<u64>,
    pub name: String,
    pub logo_url: String,
    pub e_tag: String,
    pub logo_name: String,
    pub description: Option<String>,
    #[validate(length(min = 0, max = 200), required)]
    pub region: Option<String>,
    #[validate(length(min = 0, max = 50), required)]
    pub founder: Option<String>,
    #[schema(value_type = String)]
    pub established_time: NaiveDate,
}

#[derive(Debug, ToSchema, FromRow, Validate, Deserialize, Serialize, IntoParams)]
pub struct GetCompanyStudioReq {
    pub id: Option<u64>,
    pub name: Option<String>,
    pub region: Option<String>,
    #[validate(length(min = 0, max = 50), required)]
    pub founder: Option<String>,
    pub established_start_time: Option<String>,
    pub established_end_time: Option<String>,
    pub limit: Option<u64>,
    pub page: Option<u64>,
}

#[derive(Debug, ToSchema, FromRow, Validate, Deserialize, Serialize, IntoParams)]
pub struct GetCompanyStudioDetailReq {
    pub id: u64,
}

#[derive(Debug, ToSchema, FromRow, Validate, Deserialize, Serialize, IntoParams)]
pub struct DeleteCompanyStudioDetailReq {
    pub id: u64,
}

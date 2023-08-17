use chrono::NaiveDate;
use mysql_common::prelude::FromRow;
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, ToSchema, FromRow, Validate)]
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

#[derive(Debug, ToSchema, FromRow, Validate)]
pub struct CompanyStudioDetail {
    pub id: u64,
    pub name: String,
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

#[derive(Debug, ToSchema, FromRow, Validate)]
pub struct UploadCompanyStudioReq {
    pub id: Option<u64>,
    pub name: String,
    pub logo_url: String,
    pub description: Option<String>,
    #[validate(length(min = 0, max = 200), required)]
    pub region: Option<String>,
    #[validate(length(min = 0, max = 50), required)]
    pub founder: Option<String>,
    #[schema(value_type = String)]
    pub established_time: NaiveDate,
}

#[derive(Debug, ToSchema, FromRow, Validate)]
pub struct GetCompanyStudioReq {
    pub id: Option<u64>,
    pub name: Option<String>,
    pub region: Option<String>,
    #[validate(length(min = 0, max = 50), required)]
    pub founder: Option<String>,
    #[schema(value_type = Option<String>)]
    pub established_start_time: Option<NaiveDate>,
    #[schema(value_type = Option<String>)]
    pub established_end_time: Option<NaiveDate>,
    pub limit: Option<u64>,
    pub page: Option<u64>,
}

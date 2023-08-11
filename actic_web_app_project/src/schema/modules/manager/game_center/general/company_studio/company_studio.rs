use chrono::NaiveDate;
use mysql_common::prelude::FromRow;
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, ToSchema, FromRow)]
pub struct CompanyStudio {
    pub id: u64,
    pub name: String,
    pub logo_url: String,
    pub description: String,
    #[schema(value_type = String)]
    pub update_time: NaiveDate,
    #[schema(value_type = String)]
    pub create_time: NaiveDate,
}

#[derive(Debug, ToSchema, FromRow, Validate)]
pub struct CompanyStudioDetail {
    pub id: u64,
    pub name: String,
    pub logo_url: String,
    #[validate(length(min = 0, max = 500), required)]
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

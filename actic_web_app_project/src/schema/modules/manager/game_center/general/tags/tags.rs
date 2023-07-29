use chrono::NaiveDate;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, ToSchema, FromRow, Serialize, Deserialize)]
pub struct Tag {
    pub id: u128,
    pub name: String,
    pub description: Option<String>,
    pub bg_color: String,
    pub border_color: String,
    pub text_color: String,
    #[schema(value_type = String)]
    pub update_time: NaiveDate,
    #[schema(value_type = String)]
    pub create_time: NaiveDate,
}

#[derive(Debug, ToSchema, Serialize, Deserialize)]
pub struct UpdateTagReq {
    pub id: Option<u128>,
    pub name: String,
    pub description: Option<String>,
    pub bg_color: String,
    pub border_color: String,
    pub text_color: String,
}

#[derive(Debug, ToSchema, Serialize, Deserialize, IntoParams)]
pub struct TagLimitReq {
    pub limit: Option<u128>,
    pub page: Option<u128>,
    pub id: Option<u128>,
    pub name: Option<String>,
}

#[derive(Debug, ToSchema, Serialize, Deserialize, IntoParams)]
pub struct DeleteTagReq {
    pub id: u128,
}
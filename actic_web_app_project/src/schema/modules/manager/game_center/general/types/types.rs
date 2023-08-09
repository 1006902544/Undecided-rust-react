use crate::schema::modules::manager::manager::FileObject;
use chrono::NaiveDate;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

#[derive(Debug, Validate, Serialize, Deserialize, ToSchema, FromRow)]
pub struct GameType {
    pub id: u64,
    #[validate(length(min = 3, max = 20))]
    pub name: String,
    pub e_tag: String,
    pub logo_url: String,
    pub filename: String,
    #[validate(length(min = 0, max = 200), required)]
    pub description: Option<String>,
    #[schema(value_type = String)]
    pub update_time: NaiveDate,
    #[schema(value_type = String)]
    pub create_time: NaiveDate,
}

#[derive(Debug, Serialize, Deserialize, ToSchema, IntoParams)]
pub struct GameTypeLimitReq {
    pub id: Option<u64>,
    pub name: Option<String>,
    pub limit: Option<u64>,
    pub page: Option<u64>,
}

#[derive(Debug, Validate, Serialize, Deserialize, ToSchema)]
pub struct UpdateGameTypeReq {
    pub id: Option<u64>,
    #[validate(length(min = 3, max = 20))]
    pub name: String,
    pub logo: FileObject,
    #[validate(length(min = 0, max = 200), required)]
    pub description: Option<String>,
}

#[derive(Debug, Validate, Serialize, Deserialize, ToSchema, IntoParams)]
pub struct DeleteGameTypeReq {
    pub id: u64,
}

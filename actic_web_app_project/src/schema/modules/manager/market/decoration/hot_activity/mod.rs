use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, FromRow)]
pub struct HotActivity {
    pub id: u64,
    pub cover_url: String,
    pub title: String,
    pub sort: u64,
    pub activity_type: String,
    pub price: Option<f64>,
    pub discount: Option<f64>,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema)]
pub struct UpdateHotActivityReq {
    pub id: u64,
    pub sort: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct DeleteHotActivityReq {
    pub id: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct GetHotActivityReq {
    pub limit: Option<u64>,
    pub page: Option<u64>,
    pub title: Option<String>,
}

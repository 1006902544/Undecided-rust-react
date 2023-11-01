use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, FromRow)]
pub struct Carousel {
    pub id: u64,
    pub cover_url: String,
    pub link_url: Option<String>,
    pub title: Option<String>,
    pub subtitle: Option<String>,
    pub content: Option<String>,
    pub sort: u64,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema)]
pub struct UpdateCarouselReq {
    pub id: Option<u64>,
    pub cover_url: String,
    pub link_url: Option<String>,
    pub title: Option<String>,
    pub sort: u64,
    pub subtitle: Option<String>,
    pub content: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct DeleteCarouselReq {
    pub id: u64,
}

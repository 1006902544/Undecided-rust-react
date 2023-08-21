use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, ToSchema, Deserialize, Serialize, FromRow)]
pub struct ImagesObject {
    pub e_tag: String,
    pub file_name: String,
    pub file_url: String,
    pub create_time: String,
}

#[derive(Debug, Clone, ToSchema, Deserialize, Serialize)]
pub struct UpdateImageObjectReq {
    pub e_tag: String,
    pub file_name: String,
    pub file_url: String,
}

#[derive(Debug, Clone, ToSchema, Deserialize, Serialize, IntoParams)]
pub struct DeleteImageObjectReq {
    pub e_tag: String,
}

#[derive(Debug, Clone, ToSchema, Deserialize, Serialize, IntoParams)]
pub struct MaterialImageLimitReq {
    pub e_tag: Option<String>,
    pub limit: Option<u64>,
    pub page: Option<u64>,
}

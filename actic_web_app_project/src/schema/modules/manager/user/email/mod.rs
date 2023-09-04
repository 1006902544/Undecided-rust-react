use mysql_common::prelude::FromRow;
use serde::*;
use utoipa::ToSchema;

#[derive(Debug, Clone, ToSchema, Deserialize, Serialize, FromRow)]
pub struct EmailRow {
    pub email: String,
    pub captcha: String,
}

#[derive(Debug, Clone, ToSchema, Deserialize, Serialize)]
pub struct SendEmailReq {
    pub email: String,
}

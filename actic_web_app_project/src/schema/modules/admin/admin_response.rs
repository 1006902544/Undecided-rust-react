use super::admin::AdminInfo;
use actix_web::web::Json;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[aliases(
    AdminInfoRes = ResponseData<AdminInfo>,
    SignInRes = ResponseData<String>,
    SignUpRes = ResponseData<u128>,
    ResPonseU8 = ResponseData<u8>,
    ResPonseString = ResponseData<String>,
)]
pub struct ResponseData<B> {
    pub data: B,
    pub message: &'static str,
    pub status: i64,
}

impl<B> ResponseData<B> {
    #[allow(unused)]
    pub fn into_json_response(self) -> Json<Self> {
        Json(self)
    }
    #[allow(unused)]
    pub fn new(data: B) -> ResponseData<B> {
        ResponseData {
            data,
            message: "success",
            status: 200,
        }
    }

    #[allow(unused)]
    pub fn new_with_status_message(data: B, status: i64, message: &'static str) -> Self {
        ResponseData {
            data,
            message,
            status,
        }
    }
}

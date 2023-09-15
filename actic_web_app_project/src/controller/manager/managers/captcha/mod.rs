use actix_web::{
    post,
    web::{Data, Json},
    Responder, ResponseError,
};
use captcha::Captcha;
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{manager_response::ResponseData, managers::captcha::*},
    server::manager::managers::captcha as captcha_service,
    utils::email,
};

#[utoipa::path(
  post,
  path = "/manager/managers/captcha/send",
  request_body = SendEmailReq,
  responses (
    (
      status = 200,
      description = "send success",
      body = SendManagerEmailResData
    )
  )
)]
#[post("/send")]
///send manager email
pub async fn send_manager_email(
    data: Json<SendManagerEmailReq>,
    pool: Data<Pool>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let captcha = Captcha::new().add_chars(6).chars_as_string();
    match captcha_service::insert_email_if_none(
        &mut conn,
        ManagerEmailRow {
            captcha: captcha.clone(),
            email: data.email.clone(),
        },
    )
    .await
    {
        Ok(is_manager) => {
            match email::send_email(data.email.clone(), "verifyCode".to_string(), captcha) {
                Ok(_) => {
                    Ok(ResponseData::new(SendManagerEmailRes { is_manager }).into_json_response())
                }
                Err(e) => Err(MyError {
                    name: e.to_string(),
                    status: Some(actix_web::http::StatusCode::BAD_REQUEST),
                }),
            }
        }
        Err(e) => Err(e),
    }
}

#[utoipa::path(
  post,
  path = "/manager/managers/captcha/verify",
  request_body = EmailRow,
  responses (
    (
      status = 200,
      description = "verify success",
      body = ResPonseString
    )
  )
)]
#[post("/verify")]
///verify manager email
pub async fn verify_manager_email(
    data: Json<ManagerEmailRow>,
    pool: Data<Pool>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    match captcha_service::verify_email(&mut conn, data.into_inner()).await {
        Ok(res) => Ok(ResponseData::new(res).into_json_response()),
        Err(e) => Err(e),
    }
}

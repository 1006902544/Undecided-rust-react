use actix_web::{
    post,
    web::{Data, Json},
    Responder, ResponseError,
};
use captcha::Captcha;
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{
        manager_response::ResponseData,
        user::email::{EmailRow, SendEmailReq},
    },
    server::manager::user::email as email_server,
    utils::email,
};

#[utoipa::path(
  post,
  path = "/manager/user/email/send",
  request_body = SendEmailReq,
  responses (
    (
      status = 200,
      description = "send success",
      body = ResPonseString
    )
  )
)]
#[post("/send")]
///send email
pub async fn send_email(
    data: Json<SendEmailReq>,
    pool: Data<Pool>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let captcha = Captcha::new().add_chars(6).chars_as_string();
    match email_server::insert_email_if_none(
        &mut conn,
        EmailRow {
            captcha: captcha.clone(),
            email: data.email.clone(),
        },
    )
    .await
    {
        Ok(_) => match email::send_email(data.email.clone(), "verifyCode".to_string(), captcha) {
            Ok(_) => {
                Ok(ResponseData::new("captcha had been sent to your email").into_json_response())
            }
            Err(e) => Err(MyError {
                name: e.to_string(),
                status: Some(actix_web::http::StatusCode::BAD_REQUEST),
            }),
        },
        Err(e) => Err(e),
    }
}

#[utoipa::path(
  post,
  path = "/manager/user/email/verify",
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
///verify email
pub async fn verify_email(
    data: Json<EmailRow>,
    pool: Data<Pool>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    match email_server::verify_email(&mut conn, data.into_inner()).await {
        Ok(res) => Ok(ResponseData::new(res).into_json_response()),
        Err(e) => Err(e),
    }
}

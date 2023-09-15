use actix_web::{
    get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;
pub mod captcha;

use crate::{
    app::error::MyError,
    nako::auth::encode_default,
    schema::modules::manager::{manager_response::ResponseData, managers::*},
    server::manager::{managers as manager_service, permissions::has_permission},
};

#[utoipa::path(
  get,
  params(ManagerInfoLimitReq),
  path="/manager/managers",
  responses (
    (status=200,description="success",body=ManagerInfoRes)
  )
)]
#[get("")]
///get managers limit
pub async fn get_managers_limit(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<ManagerInfoLimitReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = manager_service::get_managers_limit(&mut conn, data.into_inner()).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  post,
  request_body = ManagerSignupAccount,
  path="/manager/managers",
  responses (
    (status=200,description="success",body=ResPonseString)
  )
)]
#[post("")]
///manager account signup
pub async fn manager_signup(
    pool: Data<Pool>,
    data: Json<ManagerSignupAccount>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();

    match manager_service::manager_signup(&mut conn, data.into_inner()).await {
        Ok(_) => Ok(ResponseData::new("Signup success".to_string()).into_json_response()),
        Err(e) => Err(e),
    }
}

#[utoipa::path(
  post,
  request_body=ManagerInfoUpdate,
  path="/manager/managers/info",
  responses (
    (status=200,description="success",body=ResPonseString)
  )
)]
#[post("/info")]
///update manager info
pub async fn update_manager_info(
    pool: Data<Pool>,
    data: Json<ManagerInfoUpdate>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();

    match manager_service::update_manager_info(&mut conn, data.into_inner()).await {
        Ok(res) => {
            let info =
                manager_service::get_manager_by_id(&mut conn, res.parse::<u64>().unwrap()).await;
            match info {
                Ok(info) => match encode_default(info) {
                    Ok(code) => Ok(ResponseData::new(code).into_json_response()),
                    Err(e) => Err(MyError::encode_error(e)),
                },
                Err(err) => Err(err),
            }
        }
        Err(e) => Err(e),
    }
}

#[utoipa::path(
  post,
  request_body=ManagerSignIn,
  path="/manager/managers/signIn",
  responses (
    (status=200,description="success",body=ResPonseString)
  )
)]
#[post("/signIn")]
///manager sign in
pub async fn managers_sign_in(
    pool: Data<Pool>,
    data: Json<ManagerSignIn>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    match manager_service::manager_sign_in(&mut conn, data.into_inner()).await {
        Ok(res) => match encode_default(res) {
            Ok(code) => Ok(ResponseData::new(code).into_json_response()),
            Err(e) => Err(MyError::encode_error(e)),
        },
        Err(e) => Err(e),
    }
}

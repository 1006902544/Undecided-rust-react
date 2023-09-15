use actix_web::{
    get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;
pub mod captcha;

use crate::{
    app::error::MyError,
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
  get,
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
    req: HttpRequest,
    data: Json<ManagerSignupAccount>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match manager_service::manager_signup(&mut conn, data.into_inner()).await {
            Ok(_) => Ok(ResponseData::new("Signup success".to_string()).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  get,
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
    req: HttpRequest,
    data: Json<ManagerInfoUpdate>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match manager_service::update_manager_info(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

// #[utoipa::path(
//   get,
//   params(),
//   path="/manager/managers",
//   responses (
//     (status=200,description="success",body=)
//   )
// )]
// #[get("")]
// pub async fn get_managers_limit(
//     pool: Data<Pool>,
//     req: HttpRequest,
// ) -> Result<impl Responder, impl ResponseError> {
//     let mut conn = pool.get_conn().unwrap();
//     let has_per = has_permission(&mut conn, &req);
//     if has_per {
//     } else {
//         Err(MyError::permissions_error())
//     }
// }

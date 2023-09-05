use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{manager_response::ResponseData, user::user::*},
    server::manager::{permissions::has_permission, user::user as user_server},
};

#[utoipa::path(
  get,
  path = "/manager/user",
  params (GetUserLimitReq),
  responses (
    (
      status = 200,
      description = "success",
      body = UserRes
    )
  )
)]
#[get("")]
pub async fn get_user_limit(
    pool: Data<Pool>,
    data: Query<GetUserLimitReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match user_server::get_user_limit(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  post,
  path = "/manager/user/banned",
  request_body =  BannedUser,
  responses (
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[post("/banned")]
pub async fn banned_user(
    pool: Data<Pool>,
    data: Json<BannedUser>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match user_server::banned_user(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  delete,
  path = "/manager/user/banned",
  params (UnblockUser),
  responses (
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[delete("/banned")]
pub async fn unblock_user(
    pool: Data<Pool>,
    data: Query<UnblockUser>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match user_server::unblock_user(&mut conn, data.id).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{
        game_center::game_management::spu::notice::*, manager_response::ResponseData,
    },
    server::manager::{
        game_center::game_management::spu::notice as spu_notice_server, permissions::has_permission,
    },
};

#[utoipa::path(
  get,
  path = "/manager/gamesCenter/gamesManagement/spu/notice",
  params (SpuNoticeLimitReq),
  responses (
    (
      status = 200,
      description = "success",
      body = SpuNoticeRes
    )
  )
)]
#[get("")]
///get spu notice limit
pub async fn get_spu_notice(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<SpuNoticeLimitReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = spu_notice_server::get_notice_limit(&mut conn, data.into_inner()).await;
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
  path = "/manager/gamesCenter/gamesManagement/spu/notice",
  request_body = SpuNoticeUpdateReq,
  responses (
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[post("")]
//update spu notice
pub async fn update_spu_notice(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Json<SpuNoticeUpdateReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = match data.id {
            Some(_) => spu_notice_server::edit_notice(&mut conn, data.into_inner()).await,
            None => spu_notice_server::create_notice(&mut conn, data.into_inner()).await,
        };
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  delete,
  path = "/manager/gamesCenter/gamesManagement/spu/notice",
  params (SpuNoticeDeleteReq),
  responses (
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[delete("")]
///delete spu notice
pub async fn delete_spu_notice(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<SpuNoticeDeleteReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn: mysql::PooledConn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = spu_notice_server::delete_notice(&mut conn, data.id.clone()).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

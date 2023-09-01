use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{
        game_center::game_management::sku::notice::*, manager_response::ResponseData,
    },
    server::manager::{
        game_center::game_management::sku::notice as sku_notice_server, permissions::has_permission,
    },
};

#[utoipa::path(
get,
path = "/manager/gamesCenter/gamesManagement/sku/notice",
params (SkuNoticeLimitReq),
responses (
  (
    status = 200,
    description = "success",
    body = SkuNoticeRes
  )
)
)]
#[get("")]
///get sku notice limit
pub async fn get_sku_notice(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<SkuNoticeLimitReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = sku_notice_server::get_notice_limit(&mut conn, data.into_inner()).await;
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
path = "/manager/gamesCenter/gamesManagement/sku/notice",
request_body = SkuNoticeUpdateReq,
responses (
  (
    status = 200,
    description = "success",
    body = SkuNoticeUpdateResData
  )
)
)]
#[post("")]
//update sku notice
pub async fn update_sku_notice(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Json<SkuNoticeUpdateReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = match data.id {
            Some(_) => sku_notice_server::edit_notice(&mut conn, data.into_inner()).await,
            None => sku_notice_server::create_notice(&mut conn, data.into_inner()).await,
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
path = "/manager/gamesCenter/gamesManagement/sku/notice",
params (SkuNoticeDeleteReq),
responses (
  (
    status = 200,
    description = "success",
    body = ResPonseString
  )
)
)]
#[delete("")]
///delete sku notice
pub async fn delete_sku_notice(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<SkuNoticeDeleteReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn: mysql::PooledConn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = sku_notice_server::delete_notice(&mut conn, data.id.clone()).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

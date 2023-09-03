use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{
        game_center::game_management::sku::sku::*, manager_response::ResponseData,
    },
    server::manager::{
        game_center::game_management::sku::sku as skuServer, permissions::has_permission,
    },
};

#[utoipa::path(
    get,
    path = "/manager/gamesCenter/gamesManagement/sku",
    params(SkuLimitReq),
    responses(
      (
        status = 200,
        description = "success",
        body = SkuRes
      )
    )
)]
#[get("")]
///get sku limit
pub async fn get_sku_limit(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<SkuLimitReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match skuServer::get_sku_limit(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  post,
  path = "/manager/gamesCenter/gamesManagement/sku",
  request_body = SkuUpdateReq,
  responses(
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[post("")]
///update SKU
pub async fn update_sku(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Json<SkuUpdateReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = match data.id {
            Some(_) => skuServer::edit_sku(&mut conn, data.into_inner()).await,
            None => skuServer::create_sku(&mut conn, data.into_inner()).await,
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
  path = "/manager/gamesCenter/gamesManagement/sku",
  params (SkuDeleteReq),
  responses(
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[delete("")]
///delete sku
pub async fn delete_sku(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<SkuDeleteReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match skuServer::delete_sku(&mut conn, data.id.clone()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

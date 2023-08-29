use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{
        game_center::game_management::spu::update_record::*, manager_response::ResponseData,
    },
    server::manager::{
        game_center::game_management::spu::update_record as spu_update_record_server,
        permissions::has_permission,
    },
};

#[utoipa::path(
  get,
  path = "/manager/gamesCenter/gamesManagement/spu/updateRecord",
  params (SpuUpdateRecordLimitReq),
  responses (
    (
      status = 200,
      description = "success",
      body = SpuUpdateRecordRes
    )
  )
)]
#[get("")]
///get spu update record limit
pub async fn get_spu_update_record(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<SpuUpdateRecordLimitReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res =
            spu_update_record_server::get_update_record_limit(&mut conn, data.into_inner()).await;
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
  path = "/manager/gamesCenter/gamesManagement/spu/updateRecord",
  request_body = UpdateSpuUpdateRecord,
  responses (
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[post("")]
///update spu update record
pub async fn update_spu_update_record(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Json<UpdateSpuUpdateRecord>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = match data.id {
            Some(_) => {
                spu_update_record_server::edit_update_record(&mut conn, data.into_inner()).await
            }
            None => {
                spu_update_record_server::create_update_record(&mut conn, data.into_inner()).await
            }
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
  path = "/manager/gamesCenter/gamesManagement/spu/updateRecord",
  params (SpuUpdateRecordDeleteReq),
  responses (
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[delete("")]
///delete spu update record
pub async fn delete_spu_update_record(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<SpuUpdateRecordDeleteReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn: mysql::PooledConn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = spu_update_record_server::delete_update_record(&mut conn, data.id.clone()).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{
        game_center::game_management::spu::spu::*, manager_response::ResponseData,
    },
    server::manager::{
        game_center::game_management::spu::spu as spuServer, permissions::has_permission,
    },
};

#[utoipa::path(
  post,
  path = "/manager/gamesCenter/gamesManagement/spu",
  request_body = UpdateSpuReq,
  responses (
    (status = 200 , body = SpuUpdateResData , description = "success")
    )
)]
#[post("")]
///update SPU
pub async fn update_spu(
    pool: Data<Pool>,
    data: Json<UpdateSpuReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = match data.id {
            Some(_) => spuServer::edit_spu(&mut conn, data.into_inner()).await,
            None => spuServer::create_spu(&mut conn, data.into_inner()).await,
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
    get,
    path = "/manager/gamesCenter/gamesManagement/spu",
    params (GetSpuLimitReq),
    responses (
        (status = 200 , body = SpuRes , description = "success")
        )
    )]
#[get("")]
///get SPU limit
pub async fn get_spu_limit(
    pool: Data<Pool>,
    data: Query<GetSpuLimitReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = spuServer::get_spu_limit(&mut conn, data.into_inner()).await;
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
    path = "/manager/gamesCenter/gamesManagement/spu/detail",
    params (GetSpuDetailReq),
    responses (
        (status = 200 , body = SpuDetailRes , description = "success")
        )
    )]
#[get("/detail")]
///get SPU detail
pub async fn get_spu_detail(
    pool: Data<Pool>,
    data: Query<GetSpuDetailReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = spuServer::get_spu_detail(&mut conn, data.id.clone()).await;
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
    path = "/manager/gamesCenter/gamesManagement/spu",
    params (DeleteSpuDetailReq),
    responses (
        (status = 200 , body = ResPonseString , description = "success")
        )
    )]
#[delete("")]
///delete SPU
pub async fn delete_spu(
    pool: Data<Pool>,
    data: Query<DeleteSpuDetailReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = spuServer::delete_spu(&mut conn, data.id.clone()).await;
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
    path = "/manager/gamesCenter/gamesManagement/spu/tree",
    params (GetSpuTreeReq),
    responses (
        (status = 200 , body = SpuSkuTreeRes , description = "success")
        )
    )]
#[get("/tree")]
///get SPU tree limit
pub async fn get_spu_tree_limit(
    pool: Data<Pool>,
    data: Query<GetSpuTreeReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = spuServer::get_spu_tree_limit(&mut conn, data.into_inner()).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

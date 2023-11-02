use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{
        manager_response::ResponseData,
        market::decoration::hot_activity::{
            DeleteHotActivityReq, GetHotActivityReq, UpdateHotActivityReq,
        },
    },
    server::manager::{
        market::decoration::hot_activity as hot_activity_server, permissions::has_permission,
    },
};

#[utoipa::path(
get,
path = "/manager/market/decoration/hotActivity",
params(GetHotActivityReq),
responses (
    (status = 200 , body = MarketHotActivityRes , description = "success")
)
)]
///get hotActivity
#[get("")]
pub async fn get_hot_activity(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<GetHotActivityReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = hot_activity_server::get_hot_activity(&mut conn, data.into_inner()).await;
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
path = "/manager/market/decoration/hotActivity",
request_body = UpdateHotActivityReq,
responses (
    (status = 200 , body = ResPonseString , description = "success")
)
)]
///update hotActivity
#[post("")]
pub async fn update_hot_activity(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Json<UpdateHotActivityReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = hot_activity_server::update_hot_activity(&mut conn, data.into_inner()).await;
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
path = "/manager/market/decoration/hotActivity",
params(DeleteHotActivityReq),
responses (
    (status = 200 , body = ResPonseString , description = "success")
)
)]
///delete hotActivity
#[delete("")]
pub async fn delete_hot_activity(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<DeleteHotActivityReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = hot_activity_server::delete_hot_activity(&mut conn, data.id).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

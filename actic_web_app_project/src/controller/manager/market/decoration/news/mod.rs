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
        market::decoration::news::{DeleteNewsReq, GetNewsReq, UpdateNewsReq},
    },
    server::manager::{market::decoration::news as news_server, permissions::has_permission},
};

#[utoipa::path(
get,
path = "/manager/market/decoration/news",
params(GetNewsReq),
responses (
  (status = 200 , body = MarketNewsLimitRes , description = "success")
)
)]
///get market news
#[get("")]
pub async fn get_news(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<GetNewsReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = news_server::get_news(&mut conn, data.into_inner()).await;
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
path = "/manager/market/decoration/news",
request_body = UpdateNewsReq,
responses (
  (status = 200 , body = ResPonseString , description = "success")
)
)]
///update market news
#[post("")]
pub async fn update_news(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Json<UpdateNewsReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = news_server::update_news(&mut conn, data.into_inner()).await;
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
path = "/manager/market/decoration/news",
params(DeleteNewsReq),
responses (
  (status = 200 , body = ResPonseString , description = "success")
)
)]
///delete market news
#[delete("")]
pub async fn delete_news(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<DeleteNewsReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = news_server::delete_news(&mut conn, data.id).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

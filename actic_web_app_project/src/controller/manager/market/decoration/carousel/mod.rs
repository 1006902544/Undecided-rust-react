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
        market::decoration::carousel::{DeleteCarouselReq, UpdateCarouselReq},
    },
    server::manager::{
        market::decoration::carousel as carousel_server, permissions::has_permission,
    },
};

#[utoipa::path(
  get,
  path = "/manager/market/decoration/carousel",
  responses (
      (status = 200 , body = Vec<Carousel> , description = "success")
  )
  )]
///get carousel
#[get("/carousel")]
pub async fn get_carousel(
    pool: Data<Pool>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = carousel_server::get_carousel(&mut conn).await;
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
  path = "/manager/market/decoration/carousel",
  request_body = UpdateCarouselReq,
  responses (
      (status = 200 , body = ResPonseString , description = "success")
  )
  )]
///update carousel
#[post("/carousel")]
pub async fn update_carousel(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Json<UpdateCarouselReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = carousel_server::update_carousel(&mut conn, data.into_inner()).await;
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
  path = "/manager/market/decoration/carousel",
  params(DeleteCarouselReq),
  responses (
      (status = 200 , body = ResPonseString , description = "success")
  )
  )]
///delete carousel
#[delete("/carousel")]
pub async fn delete_carousel(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<DeleteCarouselReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = carousel_server::delete_carousel(&mut conn, data.id).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

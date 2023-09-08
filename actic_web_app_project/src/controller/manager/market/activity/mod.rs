use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{manager_response::ResponseData, market::activity::*},
    server::manager::{market::activity as activity_server, permissions::has_permission},
};

#[utoipa::path(
  get,
  path="/manager/market/activity",
  params (ActivityLimitReq),
  responses(
    (
      status = 200,
      description = "success",
      body = ActivityRes
    )
  )
)]
#[get("")]
///get activity limit
pub async fn get_activity_limit(
    pool: Data<Pool>,
    data: Query<ActivityLimitReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match activity_server::get_activity_limit(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  get,
  path="/manager/market/activity/detail",
  params (ActivityDetailReq),
  responses(
    (
      status = 200,
      description = "success",
      body = ActivityDetailRes
    )
  )
)]
#[get("/detail")]
///get activity detail
pub async fn get_activity_detail(
    pool: Data<Pool>,
    data: Query<ActivityDetailReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match activity_server::get_activity_detail(&mut conn, data.id).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  post,
  path="/manager/market/activity/base",
  request_body = ActivityUpdateStepOneReq,
  responses(
    (
      status = 200,
      description = "success",
      body = ResponseU64
    )
  )
)]
#[post("/base")]
///update activity base (step1)
pub async fn update_activity_base(
    pool: Data<Pool>,
    data: Json<ActivityUpdateStepOneReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match activity_server::update_activity_base(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  post,
  path="/manager/market/activity/info",
  request_body = ActivityUpdateStepTwoReq,
  responses(
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[post("/info")]
///update activity info (step2)
pub async fn update_activity_info(
    pool: Data<Pool>,
    data: Json<ActivityUpdateStepTwoReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match activity_server::update_activity_info(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  delete,
  path="/manager/market/activity",
  params (DeleteActivityReq),
  responses(
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[delete("")]
///delete activity
pub async fn delete_activity(
    pool: Data<Pool>,
    data: Query<DeleteActivityReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match activity_server::delete_activity(&mut conn, data.id).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  get,
  path="/manager/market/activity/goods",
  params (ActivityGoodsLimitReq),
  responses(
    (
      status = 200,
      description = "success",
      body = ActivityGoodsRes
    )
  )
)]
#[get("/goods")]
//get activity goods limit
pub async fn get_activity_goods_limit(
    pool: Data<Pool>,
    data: Query<ActivityGoodsLimitReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = if data.goods_type == "bundle" {
            activity_server::get_bundle_goods(&mut conn, data.into_inner()).await
        } else {
            activity_server::get_promotion_goods(&mut conn, data.into_inner()).await
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
  post,
  path="/manager/market/activity/goods/promotion",
  request_body = ActivityPromotionUpdateGoodsReq,
  responses(
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[post("/goods/promotion")]
///update activity promotion goods
pub async fn update_activity_promotion_goods(
    pool: Data<Pool>,
    data: Json<ActivityPromotionUpdateGoodsReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match activity_server::update_promotion_goods(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  post,
  path="/manager/market/activity/goods/bundle",
  request_body = ActivityBundleInsertGoodsReq,
  responses(
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[post("/goods/bundle")]
///update activity bundle goods
pub async fn update_activity_bundle_goods(
    pool: Data<Pool>,
    data: Json<ActivityBundleInsertGoodsReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match activity_server::insert_bundle_goods(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  delete,
  path="/manager/market/activity/goods/bundle",
  params (ActivityBundleDeleteGoodsReq),
  responses(
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[delete("/goods/bundle")]
///delete activity goods bundle
pub async fn delete_activity_goods_bundle(
    pool: Data<Pool>,
    data: Query<ActivityBundleDeleteGoodsReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match activity_server::delete_bundle_goods(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  delete,
  path="/manager/market/activity/goods/promotion",
  params (ActivityPromotionDeleteGoodsReq),
  responses(
    (
      status = 200,
      description = "success",
      body = ResPonseString
    )
  )
)]
#[delete("/goods/promotion")]
pub async fn delete_activity_goods_promotion(
    pool: Data<Pool>,
    data: Query<ActivityPromotionDeleteGoodsReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match activity_server::delete_promotion_goods(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

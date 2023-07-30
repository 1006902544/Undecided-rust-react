use crate::{
    app::error::MyError,
    nako::auth::is_manager,
    schema::modules::manager::{
        game_center::general::tags::tags::*, manager_response::ResponseData,
    },
    server::manager::{
        game_center::general::tags::tags as tags_server, permissions::has_permission,
    },
};
use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

#[utoipa::path(
  get,
  path = "/manager/gameCenter/general/tags",
  params (TagLimitReq),
  responses (
    (status = 200 , body = GameTagsRes , description = "success")
  )
)]
#[get("")]
///get tags limit
pub async fn get_tags_limit(
    pool: Data<Pool>,
    query: Query<TagLimitReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let is_manager = is_manager(&req);
    if is_manager {
        let mut conn = pool.get_conn().unwrap();
        if has_permission(&mut conn, &req) {
            let res = tags_server::get_tags_limit(&mut conn, query.into_inner()).await;
            match res {
                Ok(res) => Ok(ResponseData::new(res).into_json_response()),
                Err(e) => Err(e),
            }
        } else {
            Err(MyError::permissions_error())
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  post,
  path = "/manager/gameCenter/general/tags",
  request_body = UpdateTagReq,
  responses (
    (status = 200 , body = ResPonseU8 , description = "success")
  )
)]
#[post("")]
///update tags
pub async fn update_tags(
    pool: Data<Pool>,
    data: Json<UpdateTagReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let is_manager = is_manager(&req);
    if is_manager {
        let mut conn = pool.get_conn().unwrap();
        if has_permission(&mut conn, &req) {
            let res = tags_server::update_tags(&mut conn, data.into_inner()).await;
            match res {
                Ok(res) => Ok(ResponseData::new(res).into_json_response()),
                Err(e) => Err(e),
            }
        } else {
            Err(MyError::permissions_error())
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  delete,
  path = "/manager/gameCenter/general/tags",
  params (DeleteTagReq),
  responses (
    (status = 200 , body = ResPonseU8 , description = "success")
  )
)]
#[delete("")]
///delete tags
pub async fn delete_tags(
    pool: Data<Pool>,
    query: Query<DeleteTagReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let is_manager = is_manager(&req);
    if is_manager {
        let mut conn = pool.get_conn().unwrap();
        if has_permission(&mut conn, &req) {
            let res = tags_server::delete_tags(&mut conn, query.id).await;
            match res {
                Ok(res) => Ok(ResponseData::new(res).into_json_response()),
                Err(e) => Err(e),
            }
        } else {
            Err(MyError::permissions_error())
        }
    } else {
        Err(MyError::permissions_error())
    }
}

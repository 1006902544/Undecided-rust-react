use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{game_center::comments::comments::*, manager_response::*},
    server::manager::{
        game_center::comments::comments as comment_server, permissions::has_permission,
    },
};

#[utoipa::path(
    get,
    path = "/manager/gamesCenter/comments",
    params(CommentLimitReq),
    responses((
      status = 200,
      description = "success",
      body = CommentRes
    ))
)]
#[get("")]
///get comment limit
pub async fn get_comment_limit(
    pool: Data<Pool>,
    data: Query<CommentLimitReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = if data.status == "delete" {
            let res = comment_server::get_deleted_comment_limit(&mut conn, data.into_inner()).await;
            res
        } else {
            let res = comment_server::get_comment_limit(&mut conn, data.into_inner()).await;
            res
        };
        match res {
            Ok(res) => Ok(CommentRes::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  delete,
  path = "/manager/gamesCenter/comments",
  params(DeleteCommentReq),
  responses((
    status = 200,
    description = "success",
    body = ResPonseString
  ))
)]
#[delete("")]
///delete comments physic/logic
pub async fn delete_comment(
    pool: Data<Pool>,
    data: Query<DeleteCommentReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = if data.delete_type == "logic" {
            let res = comment_server::delete_comment_logic(&mut conn, data.id).await;
            res
        } else {
            let res = comment_server::delete_comment_physics(&mut conn, data.id).await;
            res
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
    path = "/manager/gamesCenter/comments",
    request_body = RecoverCommentReq,
    responses((
        status = 200,
        description = "success",
        body = ResPonseString
    ))
    )]
#[post("")]
///delete comments physic/logic
pub async fn recover_comment(
    pool: Data<Pool>,
    data: Json<RecoverCommentReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = comment_server::recover_comment(&mut conn, data.id).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    nako::auth::get_uid_by_token,
    schema::modules::manager::{manager_response::ResponseData, managers::avatar_audit::*},
    server::manager::{managers::avatar_audit as avatar_audit_server, permissions::has_permission},
};

#[utoipa::path(
  get,
  path="/manager/managers/avatar/audit",
  params (ManagerAvatarLimitReq),
  responses(
    (status=200,description="success",body=ManagerAvatarAuditRowRes )
  )
)]
#[get("/audit")]
pub async fn get_manager_avatar_audits(
    pool: Data<Pool>,
    data: Query<ManagerAvatarLimitReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match avatar_audit_server::get_manager_avatar_audits(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  post,
  path="/manager/managers/avatar/audit",
  request_body = ManagerAvatarAuditReq,
  responses(
    (status=200,description="success",body=ResPonseString )
  )
)]
#[post("/audit")]
pub async fn manager_avatar_audit(
    pool: Data<Pool>,
    data: Json<ManagerAvatarAuditReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match avatar_audit_server::manager_avatar_audit(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  delete,
  path="/manager/managers/avatar/audit",
  params (ManagerAvatarAuditDeleteReq),
  responses(
    (status=200,description="success",body=ResPonseString )
  )
)]
#[delete("/audit")]
pub async fn delete_manager_avatar_audit(
    pool: Data<Pool>,
    data: Query<ManagerAvatarAuditDeleteReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match avatar_audit_server::delete_manager_avatar_audit(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  post,
  path="/manager/managers/avatar/apply",
  request_body = ManagerAvatarApplyReq,
  responses(
    (status=200,description="success",body=ResPonseString )
  )
)]
#[post("/apply")]
pub async fn manager_avatar_apply(
    pool: Data<Pool>,
    data: Json<ManagerAvatarApplyReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    match get_uid_by_token(&req) {
        Some(id) => {
            let mut conn = pool.get_conn().unwrap();
            let has_per = has_permission(&mut conn, &req);
            if has_per {
                match avatar_audit_server::manager_avatar_apply(&mut conn, data.into_inner(), id)
                    .await
                {
                    Ok(res) => Ok(ResponseData::new(res).into_json_response()),
                    Err(e) => Err(e),
                }
            } else {
                Err(MyError::permissions_error())
            }
        }
        None => Err(MyError::auth_error()),
    }
}

use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    nako::auth::get_uid_by_token,
    schema::modules::manager::{manager_response::ResponseData, role::audit::*},
    server::manager::{permissions::has_permission, role::audit as role_audit_server},
};

#[utoipa::path(
  get,
  path="/manager/role/audit/current",
  responses(
    (status=200,description="success",body=CurrentRoleAuditRes)
  )
)]
#[get("/current")]
///get current role audit detail by token
pub async fn get_current_role_audit(
    pool: Data<Pool>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let uid = get_uid_by_token(&req);
    match uid {
        Some(uid) => match role_audit_server::get_current_audit(&mut conn, uid).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        },
        None => Err(MyError::auth_error()),
    }
}

#[utoipa::path(
  post,
  path="/manager/role/audit/apply",
  request_body = ApplyRoleReq,
  responses(
    (status=200,description="success",body=ResPonseString)
  )
)]
#[post("/apply")]
///create role apply
pub async fn create_role_audit(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Json<ApplyRoleReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let uid = get_uid_by_token(&req);
    match uid {
        Some(uid) => {
            match role_audit_server::create_role_audit(&mut conn, data.into_inner(), uid).await {
                Ok(res) => Ok(ResponseData::new(res).into_json_response()),
                Err(e) => Err(e),
            }
        }
        None => Err(MyError::auth_error()),
    }
}

#[utoipa::path(
  get,
  path="/manager/role/audit",
  params(RoleAuditLimitReq),
  responses(
    (status=200,description="success",body=RoleAuditRowRes)
  )
)]
#[get("")]
///get role audit limit
pub async fn get_role_audit_limit(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<RoleAuditLimitReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match role_audit_server::get_audit_limit(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  post,
  path="/manager/role/audit",
  request_body = RoleAuditReq,
  responses(
    (status=200,description="success",body=ResPonseString)
  )
)]
#[post("")]
///audit role apply
pub async fn audit_role_apply(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Json<RoleAuditReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match role_audit_server::change_role_audit_status(&mut conn, data.into_inner()).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  delete,
  path="/manager/role/audit",
  params (RoleAuditDeleteReq),
  responses(
    (status=200,description="success",body=ResPonseString)
  )
)]
#[delete("")]
///delete role audit
pub async fn delete_role_audit(
    pool: Data<Pool>,
    req: HttpRequest,
    data: Query<RoleAuditDeleteReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match role_audit_server::delete_role_audit(&mut conn, data.id).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

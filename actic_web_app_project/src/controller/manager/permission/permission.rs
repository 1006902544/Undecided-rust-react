use actix_web::{
    delete, get, post,
    web::{Data, Form, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    nako::auth::is_manager,
    schema::modules::manager::{manager_response::ResponseData, permission::permission::*},
    server::manager::permissions::{has_permission, permission as permissions_server},
};

#[utoipa::path(
  get,
  path = "/manager/permission",
  params (
    ("limit" = Option<u128>,Query,description = ""),
    ("page" = Option<u128>,Query,description = ""),
    ("id" = Option<u128>,Query,description = ""),
    ("name" = Option<String>,Query,description = ""),
    ("path" =  Option<String>,Query,description = ""),
    ("method" =  Option<String>,Query,description = ""),
  ),
  responses((
    status = 200,
    description = "success",
    body = PermissionLimitRes
  ))
)]
#[get("")]
///permission limit
pub async fn get_permission(
    pool: Data<Pool>,
    req: HttpRequest,
    query: Query<PermissionLimitQuery>,
) -> Result<impl Responder, impl ResponseError> {
    if is_manager(&req) {
        let mut conn = pool.get_conn().unwrap();
        if has_permission(&mut conn, &req) {
            let res = permissions_server::get_permission(&mut conn, query).await;
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
  path = "/manager/permission",
  request_body = UpdatePermissionBody,
  responses((
    status = 200,
    description = "success",
    body = ResPonseString
  ))
)]
#[post("")]
///permission update
pub async fn update_permission(
    pool: Data<Pool>,
    req: HttpRequest,
    body: Json<UpdatePermissionBody>,
) -> Result<impl Responder, impl ResponseError> {
    if is_manager(&req) {
        let mut conn = pool.get_conn().unwrap();
        if has_permission(&mut conn, &req) {
            let body = body.into_inner();
            let res = if body.id.is_none() {
                permissions_server::create_permission(&mut conn, &body).await
            } else {
                permissions_server::edit_permission(&mut conn, &body).await
            };
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
  path = "/manager/permission",
  params  (
    ("id" = u128 ,Query, description = ""),
  ),
  responses((
    status = 200,
    description = "success",
    body = ResPonseString
  ))
)]
#[delete("")]
///permission delete
pub async fn delete_permission(
    pool: Data<Pool>,
    req: HttpRequest,
    query: Query<DeletePermissionQuery>,
) -> Result<impl Responder, impl ResponseError> {
    if is_manager(&req) {
        let mut conn = pool.get_conn().unwrap();
        let id = query.id.parse::<u128>();
        match id {
            Ok(id) => {
                if has_permission(&mut conn, &req) {
                    let res = permissions_server::delete_permission(&mut conn, id).await;
                    match res {
                        Ok(res) => Ok(ResponseData::new(res).into_json_response()),
                        Err(err) => Err(err),
                    }
                } else {
                    Err(MyError::permissions_error())
                }
            }
            Err(e) => Err(MyError::type_err(e.to_string())),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

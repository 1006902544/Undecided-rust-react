use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{manager_response::ResponseData, role::*},
    server::manager::{permissions::has_permission, role as role_service},
};

#[utoipa::path(get, path = "/manager/role", params(ManagerRoleReq),responses((
  status = 200,description = "success",body = ManagerRoleRes
)))]
#[get("")]
///get manager roles limit
pub async fn get_manager_role_limit(
    pool: Data<Pool>,
    data: Query<ManagerRoleReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = role_service::get_manager_roles(&mut conn, data.into_inner()).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(post, path = "/manager/role", request_body = ManagerRoleUpdateReq,responses((
  status = 200,description = "success",body = ResPonseString
)))]
#[post("")]
///update manager role
pub async fn update_manager_role(
    pool: Data<Pool>,
    data: Json<ManagerRoleUpdateReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = role_service::update_manager_role(&mut conn, data.into_inner()).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(delete, path = "/manager/role", params(ManagerRoleDeleteReq),responses((
  status = 200,description = "success",body = ResPonseString
)))]
#[delete("")]
///delete manager roles
pub async fn delete_manager_role(
    pool: Data<Pool>,
    data: Query<ManagerRoleDeleteReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = role_service::delete_manager_roles(&mut conn, data.id).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

use crate::{
    app::error::MyError,
    schema::modules::manager::{manager_response::*, role::role_permission::*},
    server::manager::{
        permissions::has_permission, role::role_permission as role_permission_server,
    },
};
use actix_web::{
    get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

#[utoipa::path(
  get,
  path="/manager/role/permission",
  params(ManagerRolePermissionRowReq),
  responses(
    (status=200,description="success",body=ManagerRolePermissionRowRes)
  )
)]
#[get("")]
///get manager role permissions with permission status
pub async fn get_manager_role_permissions(
    pool: Data<Pool>,
    data: Query<ManagerRolePermissionRowReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res =
            role_permission_server::get_manager_role_permissions(&mut conn, data.into_inner())
                .await;
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
  path="/manager/role/permission",
  request_body = ManagerRolePermissionStatusReq,
  responses(
    (status=200,description="success",body=ResPonseString)
  )
)]
#[post("")]
///change role permission status
pub async fn change_role_permission_status(
    pool: Data<Pool>,
    data: Json<ManagerRolePermissionStatusReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res =
            role_permission_server::change_role_permission_status(&mut conn, data.into_inner())
                .await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

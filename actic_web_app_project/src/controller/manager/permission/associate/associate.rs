use actix_web::{
    delete, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    nako::auth::is_manager,
    schema::modules::manager::{
        manager_response::ResponseData, permission::associate::associate::*,
    },
    server::manager::permissions::{associate::associate as associate_service, has_permission},
};

#[utoipa::path(
  post,
  path = "/manager/permission/associate",
  request_body = PermissionAssociateAuthReqBody,
  responses(
    ( status=200 ,body = ResPonseU8 ,description = "success")
  )
)]
#[post("")]
///associate permission to auth
pub async fn associate(
    pool: Data<Pool>,
    body: Json<PermissionAssociateAuthReqBody>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    if is_manager(&req) {
        let mut conn = pool.get_conn().unwrap();
        let has_per = has_permission(&mut conn, &req);
        if has_per {
            let res =
                associate_service::associate_permission_auth(&mut conn, body.into_inner()).await;
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
  path = "/manager/permission/associate",
  params(
    ("uid" = u128 , Query ,description="auth id"),
    ("pid" = u128 , Query ,description="permission id"),
  ),
  responses(
    ( status=200 ,body = ResPonseU8 ,description = "success")
  )
)]
#[delete("")]
///associate permission to auth
pub async fn disassociate(
    pool: Data<Pool>,
    query: Query<PermissionDisassociateAuthReqBody>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    if is_manager(&req) {
        let mut conn = pool.get_conn().unwrap();
        let has_per = has_permission(&mut conn, &req);
        if has_per {
            let res =
                associate_service::disassociate_permission_auth(&mut conn, query.into_inner())
                    .await;
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

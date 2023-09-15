use actix_web::{
    post,
    web::{Data, Json},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{manager_response::ResponseData, router::associate::associate::*},
    server::manager::{
        permissions::has_permission, router::associate::associate as associate_server,
    },
};

#[utoipa::path(
  post,
  path = "/manager/router/associate",
  request_body = AssociateRouterAuthReq,
  responses(
      (
        status = 200,
        body = ResPonseU8,
        description = "success"
      )
    )
)]
#[post("")]
pub async fn associate_auth_router(
    pool: Data<Pool>,
    body: Json<AssociateRouterAuthReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    if has_permission(&mut conn, &req) {
        let res = if body.associate == 1 {
            let res = associate_server::associate_auth_router(&mut conn, body.into_inner()).await;
            res
        } else {
            let res =
                associate_server::disassociate_auth_router(&mut conn, body.into_inner()).await;
            res
        };
        match res {
            Ok(row) => Ok(ResponseData::new(row).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

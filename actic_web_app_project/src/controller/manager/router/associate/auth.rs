use actix_web::{
    get,
    web::{Data, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::{admin::admin_response::ResponseData, manager::router::associate::auth::*},
    server::manager::{permissions::has_permission, router::associate::auth as auth_service},
};

#[utoipa::path(
  get,
  path="/manager/router/associate/auth",
  params(
    ("rkey"=u128,Query,description=""),
    ("limit"=Option<u128>,Query,description=""),
    ("page"=Option<u128>,Query,description=""),
    ("id"=Option<u128>,Query,description=""),
    ("name"=Option<String>,Query,description=""),
    ),
    responses(
    (
    status = 200,
    body = RouterAssociateAuthLimitRes,
    description = "success"
    )
    )
)]
#[get("/auth")]
///get auth limit with router associated
pub async fn get_auth_with_router(
    pool: Data<Pool>,
    query: Query<AssociateRouterAuthLimitReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    if has_permission(&mut conn, &req) {
        let res = auth_service::get_auth_with_router_associate(&mut conn, query.into_inner()).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

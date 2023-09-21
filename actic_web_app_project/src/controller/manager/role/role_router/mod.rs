use crate::{
    app::error::MyError,
    nako::auth::get_info_by_token,
    schema::modules::manager::{manager_response::*, role::role_router::*},
    server::manager::{permissions::has_permission, role::role_router as role_router_server},
};
use actix_web::{
    get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

#[utoipa::path(
get,
path="/manager/role/router",
params(ManagerRoleRouterReq),
responses(
  (status=200,description="success",body=ManagerRoleRouterRowRes)
)
)]
#[get("")]
///get manager role router with router status
pub async fn get_manager_role_router(
    pool: Data<Pool>,
    data: Query<ManagerRoleRouterReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res =
            role_router_server::get_manager_role_router_limit(&mut conn, data.into_inner()).await;
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
path="/manager/role/router",
request_body = ManagerRoleRouterStatusReq,
responses(
  (status=200,description="success",body=ResPonseString)
)
)]
#[post("")]
///change role router status
pub async fn change_role_router_status(
    pool: Data<Pool>,
    data: Json<ManagerRoleRouterStatusReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res =
            role_router_server::change_manager_role_router_status(&mut conn, data.into_inner())
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
  get,
  path="/manager/role/router/current",
  responses(
    (status=200,description="success",body=RoutesVecRes)
  )
  )]
#[get("/current")]
///get current manager role router
pub async fn get_current_role_router(
    pool: Data<Pool>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    match get_info_by_token(&req) {
        Some(info) => {
            let role_id = info.role_id;
            match role_id {
                Some(role_id) => {
                    let mut conn = pool.get_conn().unwrap();
                    match role_router_server::get_current_role_router(&mut conn, role_id).await {
                        Ok(res) => Ok(ResponseData::new(res).into_json_response()),
                        Err(e) => Err(e),
                    }
                }
                None => Err(MyError::permissions_error()),
            }
        }
        None => Err(MyError::auth_error()),
    }
}

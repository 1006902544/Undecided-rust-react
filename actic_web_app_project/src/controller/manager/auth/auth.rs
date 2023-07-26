use crate::{
    app::error::MyError,
    nako::{
        auth::{encode_default, get_info_by_token, is_manager},
        connection::get_conn,
    },
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::{admin::admin::LoginBody, manager::auth::auth::*},
        response::ResponseData,
    },
    server::manager::{
        auth::auth::{self as auth_server},
        permissions::has_permission,
    },
};
use actix_web::{
    get, post,
    web::{Data, Form, Json, Query},
    HttpRequest, Responder, ResponseError, Result,
};
use mysql::Pool;

//获取用户信息（token）
#[utoipa::path(
    get,
    path  = "/manager/auth/info",
    responses((status = 200,description = "success",body = AdminInfoRes)),
)]
#[get("/info")]
pub(super) async fn get_admin_info(req: HttpRequest) -> Result<impl Responder, impl ResponseError> {
    match get_info_by_token(&req) {
        Some(res) => Ok(ResponseData::new(res).into_json_response()),
        None => Err(MyError::auth_error()),
    }
}

//登录
#[utoipa::path(
    post,
    path = "/manager/auth/signIn",
    request_body = LoginBody,
    responses((
    status = 200,
    description = "success",
    body = ResPonseString
)))]
#[post("/signIn")]
///sign in
pub async fn sign_in(
    body: Json<LoginBody>,
    pool: Data<Pool>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let is_manager = is_manager(&req);
    if is_manager {
        Err(MyError::permissions_error())
    } else {
        let req = body.into_inner();
        let conn: mysql::PooledConn = get_conn(pool).unwrap();
        let res = auth_server::sign_in(req, conn).await;
        match res {
            Ok(res) => {
                if res.level < 1 {
                    Err(MyError::permissions_error())
                } else {
                    match encode_default(res) {
                        Ok(code) => Ok(ResponseData::new(code).into_json_response()),
                        Err(e) => Err(MyError::encode_error(e)),
                    }
                }
            }
            Err(e) => Err(e),
        }
    }
}

//用户分页
#[utoipa::path(
    get,
    path  = "/manager/auth",
    params(
    ("name" = Option<String>, Query, description = ""),
    ("id" = Option<u128>, Query, description = ""),
    ("limit" = Option<u128>, Query, description = ""),
    ("page" = Option<u128>, Query, description = ""),
    ),
    responses((status = 200,description = "success",body = AuthLimitRes)),
)]
#[get("")]
///auth limit
pub(super) async fn get_auth_limit(
    req: HttpRequest,
    query: Query<AuthLimitReq>,
    pool: Data<Pool>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = get_conn(pool).unwrap();
    let has_per = has_permission(&mut conn, &req);

    if has_per {
        let limit = handle_limit(&query.limit);
        let page = handle_page(&query.page);

        let query = AuthLimitServiceReq {
            limit,
            page,
            name: query.name.clone(),
            id: query.id.clone(),
        };

        match auth_server::auth_limit(&mut conn, query).await {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

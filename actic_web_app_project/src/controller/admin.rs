use super::admin_doc::get_api_doc;
use crate::{
    app::error::MyError,
    nako::{auth::get_info_by_token, connection::get_conn},
    schema::{
        modules::admin::admin::{LoginBody, SignUpReq},
        response::ResponseData,
    },
    server::admin::{self as server_admin},
};
use actix_web::{
    get, post,
    web::{Data, Form},
    HttpRequest, Responder, ResponseError, Result,
};
use mysql::Pool;

#[get("")]
pub async fn index(_req: HttpRequest) -> Result<impl Responder, impl ResponseError> {
    match get_api_doc() {
        Ok(doc) => Ok(doc),
        Err(e) => Err(e),
    }
}

//获取用户信息（token）
#[utoipa::path(
    get,
    path  = "/admin/info",
    responses((status = 200,description = "success",body = AdminInfoRes)),
)]
#[get("/info")]
pub(super) async fn get_admin_info(req: HttpRequest) -> Result<impl Responder, impl ResponseError> {
    match get_info_by_token(&req) {
        Some(res) => Ok(ResponseData::new(res).into_json_response()),
        None => Err(MyError::auth_error()),
    }
}

//注册
#[utoipa::path(
    post,
    path = "/admin/signUp",
    request_body = SignUpReq,
    responses((
    status = 200,
    description = "success",
    body = SignUpRes
)))]
#[post("/signUp")]
pub async fn sign_up(
    body: Form<SignUpReq>,
    pool: Data<Pool>,
) -> Result<impl Responder, impl ResponseError> {
    let sign_up_req: SignUpReq = body.into_inner();
    let conn: mysql::PooledConn = get_conn(pool).unwrap();

    let res = server_admin::sign_up(sign_up_req, conn);

    match res {
        Ok(id) => Ok(ResponseData::new(id).into_json_response()),
        Err(e) => Err(e),
    }
}

//登录
#[utoipa::path(
    post,
    path = "/admin/signIn",
    request_body = LoginBody,
    responses((
    status = 200,
    description = "success",
    body = SignInRes
)))]
#[post("/signIn")]
pub async fn sign_in(body: Form<LoginBody>, pool: Data<Pool>) -> Result<impl Responder, MyError> {
    let req = body.into_inner();
    let conn: mysql::PooledConn = get_conn(pool).unwrap();
    let res = server_admin::sign_in(req, conn);
    match res {
        Ok(_) => Ok(ResponseData::new("code").into_json_response()),
        // match encode_default(res) {
        //     Ok(code) => Ok(ResponseData::new("code").into_json_response()),
        //     Err(e) => Err(MyError::encode_error(e)),
        // }
        Err(e) => Err(e),
    }
}

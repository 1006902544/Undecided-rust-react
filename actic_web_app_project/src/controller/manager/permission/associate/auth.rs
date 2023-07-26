use crate::{
    app::error::MyError,
    schema::modules::manager::{manager_response::ResponseData, permission::associate::auth::*},
    server::manager::permissions::{associate::auth as associate_service, has_permission},
};
use actix_web::{
    get,
    web::{Data, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

#[utoipa::path(
    get,
    path="/manager/permission/associate/auth",
    params (
        ("pid" = u128,Query,description=""),
        ("limit" = Option<u128>,Query,description=""),
        ("page" = Option<u128>,Query,description=""),
        ("id" = Option<u128>,Query,description=""),
        ("name" = Option<String>,Query,description=""),
    ),
    responses(
        (status = 200 ,description = "success" , body = PermissionAssociateAuthLimitRes)
    ))]
#[get("/auth")]
///get permission auth with whether is associated
pub async fn get_permission_auth(
    pool: Data<Pool>,
    req: HttpRequest,
    query: Query<AssociateAuthLimitReq>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res =
            associate_service::get_permission_associate_auth(&mut conn, query.into_inner()).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

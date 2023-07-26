use crate::{
    app::error::MyError,
    nako::auth::{get_info_by_token, get_uid_by_token},
    schema::modules::manager::{manager_response::*, router::router::*},
    server::admin::get_self_info,
    server::manager::{permissions::has_permission, router::router as router_service},
};
use actix_web::{
    delete, get, post,
    web::{Data, Form, Json, Query},
    HttpRequest, Responder,
};
use mysql::{Pool, PooledConn};
use utoipa;

#[utoipa::path(post, path = "/manager/router", responses((
  status = 200 ,
  description = "success",
  body = ResPonseU8
)))]
///update router
#[post("")]
pub async fn update_router(
    body: Json<Route>,
    pool: Data<Pool>,
    req: HttpRequest,
) -> Result<impl Responder, MyError> {
    let mut conn: PooledConn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match get_uid_by_token(&req) {
            Some(id) => {
                let level = get_self_info(id, &mut conn).unwrap().level;
                if level < 2 {
                    Err(MyError::permissions_error())
                } else {
                    let body = body.into_inner();
                    match body.key {
                        Some(_) => match router_service::edit_route(body, &mut conn) {
                            Ok(r) => Ok(ResponseData::new(r).into_json_response()),
                            Err(e) => Err(e),
                        },
                        None => {
                            router_service::create_route(body, &mut conn);
                            Ok(ResponseData::new(1).into_json_response())
                        }
                    }
                }
            }
            None => Err(MyError::auth_error()),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
    get,
    path = "/manager/router",
    responses((
    status = 200 ,
    description = "success",
    body = RoutesVecRes
)))]
///get routes array
#[get("")]
pub async fn get_router(req: HttpRequest, pool: Data<Pool>) -> Result<impl Responder, MyError> {
    let mut conn: PooledConn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);

    if has_per {
        let info = get_info_by_token(&req);
        match info {
            Some(info) => {
                let routes = router_service::get_user_route(info.id, &mut conn);
                match routes {
                    Ok(routes) => Ok(ResponseData::new(routes).into_json_response()),
                    Err(e) => Err(e),
                }
            }
            None => Err(MyError::auth_error()),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

//删除路由
#[utoipa::path(
    delete,
    path = "/manager/router",
    params(
    ("key" = u128, Query, description = "deleting router's key"),
    )
    ,responses((
    status = 200 ,
    description = "success",
    body = ResPonseU8
    )))]
#[delete("")]
///delete router
pub async fn delete_router(
    req: HttpRequest,
    pool: Data<Pool>,
    search: Query<DeleteRouteQuery>,
) -> Result<impl Responder, MyError> {
    let mut conn: PooledConn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);

    if has_per {
        match get_uid_by_token(&req) {
            Some(id) => {
                let level = get_self_info(id, &mut conn).unwrap().level;
                if level < 2 {
                    Err(MyError::permissions_error())
                } else {
                    let res = router_service::delete_route(search.key.as_str(), &mut conn);
                    match res {
                        Ok(row) => Ok(ResponseData::new(row).into_json_response()),
                        Err(e) => Err(e),
                    }
                }
            }
            None => Err(MyError::auth_error()),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

//获取所有菜单
#[utoipa::path(
    get,
    path = "/manager/router/all",responses((
    status = 200 ,
    description = "success",
    body = RoutesVecRes
    )))]
#[get("/all")]
///get all menu
pub async fn get_all_router(req: HttpRequest, pool: Data<Pool>) -> Result<impl Responder, MyError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = router_service::get_all_router(&mut conn).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

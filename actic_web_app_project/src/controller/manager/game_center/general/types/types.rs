use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::{
        admin::admin_response::ResponseData, manager::game_center::general::types::types::*,
    },
    server::manager::{
        game_center::general::types::types as game_types_service, permissions::has_permission,
    },
};

#[utoipa::path(
    get,
    path = "/manager/gamesCenter/general/types",
    params (GameTypeLimitReq),
    responses (
        (status = 200 ,description = "success" , body = GameTypeRes)
    )
)]
#[get("")]
///get game types limit
pub async fn get_game_types(
    pool: Data<Pool>,
    query: Query<GameTypeLimitReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = game_types_service::get_game_types(&mut conn, query.into_inner()).await;
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
    path = "/manager/gamesCenter/general/types",
    request_body = UpdateGameTypeReq,
    responses (
        (status = 200 ,description = "success" , body = ResPonseString)
    )
)]
#[post("")]
///update game types
pub async fn update_game_type(
    pool: Data<Pool>,
    data: Json<UpdateGameTypeReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match data.id {
            Some(_) => {
                let res = game_types_service::update_types(&mut conn, data.into_inner()).await;
                match res {
                    Ok(res) => Ok(ResponseData::new(res).into_json_response()),
                    Err(e) => Err(e),
                }
            }
            None => {
                let res = game_types_service::create_types(&mut conn, data.into_inner()).await;
                match res {
                    Ok(res) => Ok(ResponseData::new(res).into_json_response()),
                    Err(e) => Err(e),
                }
            }
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
    delete,
    path = "/manager/gamesCenter/general/types",
    params (DeleteGameTypeReq),
    responses (
        (status = 200 ,description = "success" , body = ResPonseString)
    )
)]
#[delete("")]
///delete game type
pub async fn delete_game_type(
    pool: Data<Pool>,
    query: Query<DeleteGameTypeReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = game_types_service::delete_types(&mut conn, query.id).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

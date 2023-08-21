use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{
        manager_response::ResponseData,
        material_library::images::{
            DeleteImageObjectReq, MaterialImageLimitReq, UpdateImageObjectReq,
        },
    },
    server::manager::{material_library::images as images_server, permissions::has_permission},
};

#[utoipa::path(
    post,
    path = "/manager/materialLibrary/image",
    request_body = UpdateImageObjectReq,
    responses (
        (status = 200 , body = ResPonseString , description = "success")
    )
    )]
#[post("/image")]
///create image material
pub async fn create_image(
    body: Json<UpdateImageObjectReq>,
    pool: Data<Pool>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = images_server::create_image(&mut conn, body.into_inner()).await;
        match res {
            Ok(_) => Ok(ResponseData::new("Create success").into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
    delete,
    path = "/manager/materialLibrary/image",
    params(DeleteImageObjectReq),
    responses (
        (status = 200 , body = ResPonseString , description = "success")
    )
    )]
#[delete("/image")]
///delete image material
pub async fn delete_image(
    body: Query<DeleteImageObjectReq>,
    pool: Data<Pool>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = images_server::delete_image(&mut conn, body.e_tag.clone()).await;
        match res {
            Ok(_) => Ok(ResponseData::new("Create success").into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
    get,
    path = "/manager/materialLibrary/image",
    params(MaterialImageLimitReq),
    responses (
        (status = 200 , body = MaterialImageRes , description = "success")
    )
    )]
#[get("/image")]
///delete image material
pub async fn get_images(
    query: Query<MaterialImageLimitReq>,
    pool: Data<Pool>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = images_server::get_images(&mut conn, query.into_inner()).await;
        match res {
            Ok(_) => Ok(ResponseData::new("Create success").into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

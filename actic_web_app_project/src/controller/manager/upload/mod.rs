use actix_multipart::Multipart;
use actix_web::{
    get,
    http::StatusCode,
    post,
    web::{self, Data},
    Error, HttpRequest, HttpResponse, Responder, ResponseError,
};

use futures_util::StreamExt;
use mysql::{Pool, PooledConn};
use serde::{Deserialize, Serialize};
use std::{fs::File, io::Write};
use utoipa::ToSchema;

use crate::{
    app::error::MyError,
    nako::auth::is_manager,
    schema::modules::manager::{
        manager_response::{self, ResponseData},
        upload::AccessKey,
    },
    server::manager::permissions::has_permission,
};

#[utoipa::path(
  post,
  path = "/manager/upload/static",
  request_body( content= String,content_type = "multipart/form-data"),
  responses (
    (status = 200 , description = "" , body = ResPonseString)
  )
)]
#[post("/static")]
///upload static file
async fn upload_image(mut payload: Multipart) -> Result<impl Responder, impl ResponseError> {
    let mut name: Option<String> = None;
    while let Some(item) = payload.next().await {
        let mut field = item.unwrap();
        let cur_name = field.name();

        if cur_name == "name" {
            while let Some(chunk) = field.next().await {
                name = Some(std::str::from_utf8(&chunk.unwrap()).unwrap().to_string())
            }
        } else if cur_name == "file" {
            match name.clone() {
                Some(name) => {
                    let mut wrap = File::create(format!("./assets/images/{}", name)).unwrap();

                    while let Some(chunk) = field.next().await {
                        wrap.write_all(&chunk.unwrap()).unwrap();
                    }
                }
                None => {}
            };
        };
    }
    Ok::<actix_web::web::Json<manager_response::ResponseData<&str>>, MyError>(
        ResponseData::new("ok").into_json_response(),
    )
}

#[derive(Debug, ToSchema, Deserialize, Serialize)]
struct GetStaticFileQuery {
    name: String,
}

#[utoipa::path(get, path = "/manager/upload/static")]
#[get("/static/{filename:.*}")]
///get static file
async fn get_static_image(path: web::Path<String>) -> Result<impl Responder, impl ResponseError> {
    let filename = path.into_inner();
    let image_content =
        web::block(move || std::fs::read(format!("./assets/images/{}", &filename))).await;
    match image_content {
        Ok(file) => match file {
            Ok(file) => Ok(HttpResponse::build(StatusCode::OK)
                .content_type("image/jpeg")
                .body(file)),
            Err(_) => Err(MyError::not_found()),
        },
        Err(_) => Err(MyError::not_found()),
    }
}

#[utoipa::path(
    get,
    path = "/manager/upload/accessKey",
    responses(
    (status = 200 ,description="success" ,body = AccessKeyRes)
    )
)]
#[get("/accessKey")]
///get accessKey
async fn get_access_key(
    req: HttpRequest,
    pool: Data<Pool>,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_permission = has_permission(&mut conn, &req);
    if has_permission {
        Ok(ResponseData::new(AccessKey {
            endpoint: "minio.zxc.cc",
            port: 80,
            use_ssl: false,
            access_key: "wlfmGDKHskJscNQEQrxW",
            secret_key: "WAEsxv9gEx2VequCDqWERh4nqAXoO4EcAjiYrjEQ",
        })
        .into_json_response())
    } else {
        Err(MyError::permissions_error())
    }
}

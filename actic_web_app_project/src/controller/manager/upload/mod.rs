use actix_files as fs;
use actix_multipart::{
    form::{tempfile::TempFile, text::Text, MultipartForm},
    Multipart,
};
use actix_web::{
    get,
    http::{
        header::{ContentDisposition, DispositionType},
        StatusCode,
    },
    post,
    web::{self, Query},
    Error, HttpRequest, HttpResponse, Responder, ResponseError,
};
use fs::NamedFile;
use futures_util::{future::ok, StreamExt};
use serde::{Deserialize, Serialize};
use std::{
    borrow::BorrowMut,
    fs::File,
    io::{BufReader, Write},
    path::PathBuf,
};
use utoipa::ToSchema;

use crate::{
    app::error::MyError,
    nako::embed::Images,
    schema::modules::manager::manager_response::{self, ResponseData},
};

// #[derive(MultipartForm)]
// Attributes available to this derive:
// pub struct UploadFile {
//     name: Text<String>,
//     file: TempFile,
// }
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
async fn upload_file(mut payload: Multipart) -> Result<impl Responder, impl ResponseError> {
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
async fn get_static_file(req: HttpRequest) -> Result<impl Responder, impl ResponseError> {
    let image_content = web::block(|| std::fs::read("./assets/images/aaaaa.png")).await;
    match image_content {
        Ok(file) => match file {
            Ok(file) => Ok(HttpResponse::build(StatusCode::OK)
                .content_type("image/jpeg")
                .body(file)),
            Err(err) => Err(MyError::not_found()),
        },
        Err(err) => Err(MyError::not_found()),
    }
}

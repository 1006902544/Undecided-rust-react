use actix_multipart::{
    form::{tempfile::TempFile, text::Text, MultipartForm},
    Multipart,
};
use actix_web::{post, Error, Responder, ResponseError};
use futures_util::StreamExt;
use std::{
    borrow::BorrowMut,
    fs::File,
    io::{BufReader, Write},
};

use crate::{
    app::error::MyError,
    schema::modules::manager::manager_response::{self, ResponseData},
};

#[derive(MultipartForm)]
// Attributes available to this derive:
pub struct UploadFile {
    name: Text<String>,
    file: TempFile,
}

#[utoipa::path(
  post,
  request_body( content= String,content_type = "multipart/form-data"),
  responses (
    (status = 200 , description = "" , body = ResPonseString)
  )
)]
#[post("")]
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
                    let mut wrap = File::create(format!("./assets/images/{}", cur_name)).unwrap();

                    while let Some(chunk) = field.next().await {
                        wrap.write_all(&chunk.unwrap()).unwrap();
                    }
                }
                None => {}
            };
        }
    }

    Ok::<actix_web::web::Json<manager_response::ResponseData<&str>>, MyError>(
        ResponseData::new("ok").into_json_response(),
    )
}

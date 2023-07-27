use std::fmt::Display;

use actix_web::{
    error::{Error, ResponseError},
    http::StatusCode,
    HttpResponse, HttpResponseBuilder,
};

use derive_more::{Display, Error as DeriveError};
use serde::{Deserialize, Serialize};

#[derive(Debug, Display, DeriveError)]
#[display(fmt = "Error: {}", name)]
pub struct MyError {
    pub name: String,
    pub status: Option<StatusCode>,
}

impl ResponseError for MyError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(match self.status {
            Some(status) => status,
            None => self.status_code(),
        })
        .body(self.to_string())
    }
}

impl MyError {
    pub fn not_found() -> MyError {
        MyError {
            name: String::from("Not Found"),
            status: Some(StatusCode::NOT_FOUND),
        }
    }

    pub fn sql_error(err: mysql::Error) -> MyError {
        MyError {
            name: err.to_string(),
            status: Some(StatusCode::BAD_REQUEST),
        }
    }

    pub fn auth_error() -> MyError {
        MyError {
            name: String::from("Authorization Error"),
            status: Some(StatusCode::UNAUTHORIZED),
        }
    }

    #[allow(unused)]
    pub fn conn_error(err: mysql::Error) -> MyError {
        MyError {
            name: err.to_string(),
            status: Some(StatusCode::INTERNAL_SERVER_ERROR),
        }
    }

    pub fn encode_error(err: jsonwebtoken::errors::Error) -> MyError {
        MyError {
            name: err.to_string(),
            status: Some(StatusCode::UNAUTHORIZED),
        }
    }

    pub fn permissions_error() -> MyError {
        MyError {
            name: "No permissions".to_string(),
            status: Some(StatusCode::FORBIDDEN),
        }
    }

    pub fn type_err(e: String) -> MyError {
        MyError {
            name: e,
            status: Some(StatusCode::BAD_REQUEST),
        }
    }

    pub fn edit_err() -> MyError {
        MyError {
            name: "edit failed".to_string(),
            status: Some(StatusCode::BAD_REQUEST),
        }
    }

    pub fn create_err() -> MyError {
        MyError {
            name: "create failed".to_string(),
            status: Some(StatusCode::BAD_REQUEST),
        }
    }

    pub fn delete_err() -> MyError {
        MyError {
            name: "delete failed".to_string(),
            status: Some(StatusCode::BAD_REQUEST),
        }
    }

    pub fn no_changes_happen() -> MyError {
        MyError {
            name: "no changes happened".to_string(),
            status: Some(StatusCode::BAD_REQUEST),
        }
    }
}

//

//空data
#[derive(Debug, Deserialize, Serialize)]
struct EmptyData {}

//错误类型(status)
#[derive(Debug)]
#[allow(non_camel_case_types, unused)]
pub enum ErrorStatus {
    SELF_ERROR_BASE = 1000,
    AUTHORIZATION_ERROR = 1001,
}

impl ErrorStatus {
    pub fn into_i16(self) -> i16 {
        self as i16
    }
}

trait ErrorData: erased_serde::Serialize + std::fmt::Debug {}

//json格式错误
#[derive(Debug, Deserialize, Serialize)]
pub struct JsonError<T: std::fmt::Debug + Serialize> {
    pub msg: &'static str,
    pub status: i16,
    pub data: T,
}

impl<T: std::fmt::Debug + Serialize> Display for JsonError<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Display::fmt(&self, f)
    }
}

impl<T: std::fmt::Debug + Serialize> ResponseError for JsonError<T> {
    fn error_response(&self) -> HttpResponse {
        let mut res = HttpResponseBuilder::new(self.status_code());
        res.json(self)
    }
}

//未登录
#[allow(unused)]
pub fn auth_err() -> Error {
    let err: JsonError<Option<()>> = JsonError {
        msg: "Unauthorized Error",
        status: ErrorStatus::AUTHORIZATION_ERROR.into_i16(),
        data: None,
    };
    err.into()
}

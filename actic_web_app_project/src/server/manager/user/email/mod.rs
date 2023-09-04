use actix_web::http::StatusCode;
use mysql::{prelude::Queryable, PooledConn};
use mysql_common::params;

use crate::{
    app::error::MyError,
    schema::modules::manager::user::email::{EmailRow, SendEmailReq},
};

pub async fn insert_email_if_none(
    conn: &mut PooledConn,
    data: EmailRow,
) -> Result<String, MyError> {
    let sql_str = "select email,captcha from email_verify where email=:email";
    let res: Result<Option<EmailRow>, mysql::Error> = conn.exec_first(
        sql_str,
        params! {
          "email" => data.email.clone()
        },
    );
    match res {
        Ok(res) => match res {
            Some(_) => Err(MyError {
                status: Some(StatusCode::FORBIDDEN),
                name: "please try latter".to_string(),
            }),
            None => {
                let sql_str = "insert into email_verify (email,captcha) values (:email,:captcha)";
                let res = conn.exec_drop(
                    sql_str,
                    params! {
                      "email" => data.email,
                      "captcha" => data.captcha,
                    },
                );
                match res {
                    Ok(()) => Ok("send success".to_string()),
                    Err(e) => Err(MyError::sql_error(e)),
                }
            }
        },
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn verify_email(conn: &mut PooledConn, data: EmailRow) -> Result<String, MyError> {
    let sql_str = "select email,captcha from email_verify where email=:email and captcha=:captcha";
    let res: Result<Option<EmailRow>, mysql::Error> = conn.exec_first(
        sql_str,
        params! {
          "email" => data.email,
          "captcha" => data.captcha,
        },
    );
    match res {
        Ok(res) => match res {
            Some(res) => Ok("verify success".to_string()),
            None => Err(MyError {
                name: "the captcha is wrong or expires".to_string(),
                status: Some(StatusCode::FORBIDDEN),
            }),
        },
        Err(e) => Err(MyError::sql_error(e)),
    }
}

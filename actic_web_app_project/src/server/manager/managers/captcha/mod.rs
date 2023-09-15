use actix_web::http::StatusCode;
use chrono::{Local, NaiveDateTime};
use mysql::{prelude::Queryable, PooledConn};
use mysql_common::params;

use crate::{app::error::MyError, schema::modules::manager::managers::captcha::*};

pub async fn insert_email_if_none(
    conn: &mut PooledConn,
    data: ManagerEmailRow,
) -> Result<u8, MyError> {
    let sql_str = "select update_time from manager_email where email=:email";
    let res: Result<Option<NaiveDateTime>, mysql::Error> = conn.exec_first(
        sql_str,
        params! {
            "email" => data.email.clone()
        },
    );
    match res {
        Ok(res) => {
            let could_send = match res {
                Some(update_time) => {
                    let update_time = update_time.timestamp();
                    let now_time = Local::now().naive_local().timestamp();
                    if now_time - update_time <= 60 {
                        false
                    } else {
                        true
                    }
                }
                None => true,
            };
            if could_send {
                {
                    let sql_str = "insert into manager_email (email,captcha) values (:email,:captcha) on duplicate key update captcha=:captcha";
                    let res = conn.exec_drop(
                        sql_str,
                        params! {
                            "email" => data.email.clone(),
                            "captcha" => data.captcha,
                        },
                    );
                    match res {
                        Ok(()) => {
                            match conn.exec_first::<u64, _, _>(
                                "select id from manager_base where email=:email",
                                params! {
                                    "email" => data.email,
                                },
                            ) {
                                Ok(res) => {
                                    let is_manager = match res {
                                        Some(_) => 1,
                                        None => 0,
                                    };
                                    Ok(is_manager)
                                }
                                Err(e) => Err(MyError::sql_error(e)),
                            }
                        }
                        Err(e) => Err(MyError::sql_error(e)),
                    }
                }
            } else {
                Err(MyError {
                    status: Some(StatusCode::FORBIDDEN),
                    name: "Please try latter".to_string(),
                })
            }
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn verify_email(conn: &mut PooledConn, data: ManagerEmailRow) -> Result<String, MyError> {
    let sql_str = "select email,captcha from manager_email where email=:email and captcha=:captcha";
    let res: Result<Option<(String, String)>, mysql::Error> = conn.exec_first(
        sql_str,
        params! {
          "email" => data.email,
          "captcha" => data.captcha,
        },
    );
    match res {
        Ok(res) => match res {
            Some(_) => Ok("verify success".to_string()),
            None => Err(MyError {
                name: "the captcha is wrong or expires".to_string(),
                status: Some(StatusCode::FORBIDDEN),
            }),
        },
        Err(e) => Err(MyError::sql_error(e)),
    }
}

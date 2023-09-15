use actix_web::http::StatusCode;
use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{after_update, get_current, get_total},
    schema::{
        base_struct::handle_limit,
        modules::manager::{manager_response::*, managers::*},
    },
};

pub async fn get_managers_limit(
    conn: &mut PooledConn,
    data: ManagerInfoLimitReq,
) -> Result<ManagerInfoLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_limit(&data.page);
    let stmt = "select sql_calc_found_rows * from manager_info where (id=:id or :id=null) and (username=:username or :username=null) and (name=:name or :name=null) and (gender=:gender or :gender is null) and (role_id=:role_id or :role_id is null) order by update_time desc limit :scope,:limit";
    let res = conn.exec(
        stmt,
        params! {
          "id" => data.id,
          "username" => data.username,
          "name" => data.name,
          "gender" => data.gender,
          "role_id" => data.role_id,
          "scope" => limit*(page-1),
          "limit" => limit,
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(ManagerInfoLimitRes {
                total,
                current,
                results: Some(res),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn manager_signup(
    conn: &mut PooledConn,
    data: ManagerSignupAccount,
) -> Result<String, MyError> {
    let email_verify: Result<Option<String>, mysql::Error> = conn.exec_first(
        "select email from email_verify where email=:email and captcha=:captcha",
        params! {
          "email" => data.email,
          "captcha" => data.captcha,
        },
    );
    match email_verify {
        Ok(email) => match email {
            Some(email) => {
                let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
                let stmt = "insert into manager_base (username,email,password) values (:username,:email,:password)";
                let res = trans.exec_drop(
                    stmt,
                    params! {
                      "username" => data.username,
                      "email" => email,
                      "password" => data.password,
                    },
                );
                match after_update(trans, res) {
                    Ok(_) => Ok("Signup success".to_string()),
                    Err(e) => Err(e),
                }
            }
            None => Err(MyError {
                status: Some(StatusCode::NOT_FOUND),
                name: "Captcha error".to_string(),
            }),
        },
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn update_manager_info(
    conn: &mut PooledConn,
    data: ManagerInfoUpdate,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "insert into manager_info (id,name,avatar,gender,age,mobile,role_id,role_name) values (:id,:name,:avatar,:gender,:age,:mobile,:role_id,:role_name)
    on duplicate key update name=:name,avatar=:avatar,gender=:gender,age=:age,mobile=:mobile,role_id=:role_id,role_name=:role_name";
    let res = trans.exec_drop(
        stmt,
        params! {
          "id" => data.id,
          "name" => data.name,
          "avatar" => data.avatar,
          "gender" => data.gender,
          "age" => data.age,
          "mobile" => data.mobile,
          "role_id" => data.role_id,
          "role_name" => data.role_name,
        },
    );
    match after_update(trans, res) {
        Ok(id) => match id {
            Some(id) => Ok(id),
            None => Err(MyError::not_found()),
        },
        Err(e) => Err(e),
    }
}

pub async fn manager_sign_in(conn: &mut PooledConn, data: ManagerSignIn) {}

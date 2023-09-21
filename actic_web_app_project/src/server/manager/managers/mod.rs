use actix_web::http::StatusCode;
use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;
pub mod captcha;

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
    let stmt = "select sql_calc_found_rows * from manager_info where
    (id=:id or :id is null) and (username=:username or :username is null) and (name=:name or :name is null) and
    (gender=:gender or :gender is null) and (role_id=:role_id or :role_id is null)
    order by update_time desc limit :scope,:limit";
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
        "select email from manager_email where email=:email and captcha=:captcha",
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
    id: u64,
) -> Result<u64, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "insert into manager_info (id,name,avatar,gender,age,mobile,username,email) values (:id,:name,:avatar,:gender,:age,:mobile,:username,:email)
    on duplicate key update name=:name,avatar=:avatar,gender=:gender,age=:age,mobile=:mobile,username=:username,email=:email";
    let res = trans.exec_drop(
        stmt,
        params! {
            "id" => id,
            "name" => data.name,
            "avatar" => data.avatar,
            "gender" => data.gender,
            "age" => data.age,
            "mobile" => data.mobile,
            "username" => data.username,
            "email" => data.email,
        },
    );
    match res {
        Ok(_) => {
            trans.commit().unwrap();
            Ok(id)
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}

pub async fn get_manager_by_id(conn: &mut PooledConn, id: u64) -> Result<ManagerInfo, MyError> {
    let res = conn.exec_first("
    select mb.id,mb.username,mb.email,mi.name,mi.avatar,mi.gender,mi.age,mi.age,mi.mobile,mi.role_id,mi.role_name,mi.create_time,mi.update_time from manager_base as mb
    left join manager_info as mi on mi.id=mb.id
    where mb.id=:id
    ", params! {"id" => id});
    match res {
        Ok(res) => match res {
            Some(res) => Ok(res),
            None => Err(MyError::not_found()),
        },
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn manager_sign_in(
    conn: &mut PooledConn,
    data: ManagerSignIn,
) -> Result<ManagerInfo, MyError> {
    let res = match data.email.clone() {
        Some(_) =>  conn.exec_first::<ManagerInfo, _, _>(
            "select mb.id,mb.username,mb.email,mi.name,mi.avatar,mi.gender,mi.age,mi.age,mi.mobile,mi.role_id,mi.role_name,mi.create_time,mi.update_time from manager_email as me
                left join manager_base as mb on mb.email=me.email
                left join manager_info as mi on mi.email=me.email
                where me.email=:email",
            params! {
                "email" => data.email.clone()
            },
        ),
        None => conn.exec_first::<ManagerInfo, _, _>(
            "select mb.id,mb.username,mb.email,mi.name,mi.avatar,mi.gender,mi.age,mi.age,mi.mobile,mi.role_id,mi.role_name,mi.create_time,mi.update_time from manager_base as mb
            left join manager_info as mi on mi.email=mb.email
            where mb.username=:username and mb.password=:password",
            params! {
                "username" => data.username,
                "password" => data.password
            },
        ),
    };
    match res {
        Ok(res) => match res {
            Some(res) => Ok(res),
            None => Err(MyError {
                status: Some(StatusCode::FORBIDDEN),
                name: match data.email.clone() {
                    Some(_) => "The captcha is not recognized".to_string(),
                    None => "The username or password is not recognized".to_string(),
                },
            }),
        },
        Err(e) => Err(MyError::sql_error(e)),
    }
}

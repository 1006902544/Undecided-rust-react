use std::fmt::format;

use crate::{
    app::error::MyError,
    nako::connection::{get_current, get_total, handle_none},
    schema::{
        base_struct::LimitResults,
        modules::{
            admin::admin::{AdminInfo, LoginBody},
            manager::auth::auth::*,
        },
    },
};
use actix_http::StatusCode;
use mysql::{
    from_row,
    prelude::{Queryable, TextQuery},
    PooledConn, TxOpts,
};

//登录
pub async fn sign_in(data: LoginBody, mut conn: PooledConn) -> Result<AdminInfo, MyError> {
    let LoginBody { username, password } = data;
    let sql_str = format!(
        "select id from admin_login where username = '{}' and password = '{}' limit 1",
        username, password
    );
    let res = conn.query::<u128, String>(sql_str);
    match res {
        Ok(info) => {
            if info.is_empty() {
                Err(MyError {
                    name: String::from("账号或密码错误"),
                    status: Some(StatusCode::NOT_FOUND),
                })
            } else {
                let id = info[0];
                let sql_str = format!("select * from admin where id={} limit 1", id);
                let res = conn.query_map(
                    sql_str,
                    |(id, name, age, status, gender, create_time, update_time, level, username)| {
                        AdminInfo {
                            id,
                            name,
                            age,
                            status,
                            gender,
                            create_time,
                            update_time,
                            level,
                            username,
                        }
                    },
                );
                match res {
                    Ok(mut users) => {
                        let user = users.pop();
                        match user {
                            Some(user) => Ok(user),
                            None => Err(MyError::not_found()),
                        }
                    }
                    Err(e) => Err(MyError::sql_error(e)),
                }
            }
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

//管理端用户分页
pub async fn auth_limit(
    conn: &mut PooledConn,
    limit: AuthLimitServiceReq,
) -> Result<LimitResults<AdminInfo>, MyError> {
    let sql_str = format!(
        "select SQL_CALC_FOUND_ROWS * from admin where (id={id} or {id} is null) and (name={name} or {name} is null) and level > 0 limit {scope},{limit}",
        id = handle_none(&limit.id,false),
        name = handle_none(&limit.name,false),
        scope = limit.limit * (limit.page - 1),
        limit = limit.limit,
    );
    let res: Result<Vec<AdminInfo>, mysql::Error> = conn.query(sql_str);
    let total = get_total(conn);
    let current = get_current(total, limit.page, limit.limit);

    match res {
        Ok(res) => Ok(LimitResults {
            results: Some(res),
            total,
            current,
        }),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

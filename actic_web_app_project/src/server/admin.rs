use crate::{
    app::error::MyError,
    schema::modules::admin::admin::{AdminInfo, LoginBody, SignUpReq},
};
use actix_web::http::StatusCode;
use mysql::{prelude::Queryable, Error, PooledConn, TxOpts};

//注册
pub fn sign_up(data: SignUpReq, mut conn: PooledConn) -> Result<u128, MyError> {
    let sql_str = format!("insert into admin_base values(null);");

    let mut conn = conn.start_transaction(TxOpts::default()).unwrap();
    conn.query::<String, String>(sql_str).unwrap();
    let id = conn.last_insert_id();

    let insert_err = MyError {
        name: String::from("insert failed"),
        status: Some(StatusCode::BAD_REQUEST),
    };

    match id {
        Some(id) => {
            let sql_str = format!(
                "insert into admin_login (id,username,password) values({id},'{}','{}');",
                data.username, data.password
            );

            match conn.query::<String, String>(sql_str) {
                Ok(_) => {
                    let sql_str = format!(
                        "insert into admin (id,name,age,status,gender) values({id},'{}',{},{},{});",
                        data.name,
                        data.age,
                        1,
                        match data.gender {
                            Some(gender) => gender,
                            None => 0,
                        }
                    );

                    match conn.query::<String, String>(sql_str) {
                        Ok(_) => {
                            conn.commit().unwrap();
                            Ok(id as u128)
                        }
                        Err(e) => {
                            conn.rollback().unwrap();
                            Err(MyError {
                                name: e.to_string(),
                                status: Some(StatusCode::BAD_REQUEST),
                            })
                        }
                    }
                }
                Err(e) => {
                    conn.rollback().unwrap();
                    Err(MyError {
                        name: e.to_string(),
                        status: Some(StatusCode::BAD_REQUEST),
                    })
                }
            }
        }
        None => {
            conn.rollback().unwrap();
            Err(insert_err)
        }
    }
}

//登录
pub fn sign_in(data: LoginBody, mut conn: PooledConn) -> Result<AdminInfo, MyError> {
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
                    |(id, name, age, status, gender, create_time, update_time, level)| AdminInfo {
                        id,
                        name,
                        age,
                        status,
                        gender,
                        create_time,
                        update_time,
                        level,
                        username: username.to_string(),
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

//获取用户信息
pub fn get_self_info(id: u128, conn: &mut PooledConn) -> Result<AdminInfo, MyError> {
    let sql_str = format!(
        "select a.id,a.name,l.username,a.age,a.status,a.gender,a.create_time,a.update_time,a.level from admin as a , admin_login as l where a.id = {id} and l.id = {id} limit 1;"
    );
    let res: Result<Vec<AdminInfo>, Error> = conn.query(sql_str);
    match res {
        Ok(mut res) => {
            if res.is_empty() {
                Err(MyError::not_found())
            } else {
                let info = res.remove(0);
                Ok(info)
            }
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

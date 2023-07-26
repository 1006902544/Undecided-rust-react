use crate::app::error::MyError;
use crate::nako::connection::handle_none;
use crate::schema::modules::manager::router::router::*;
use actix_http::StatusCode;
use mysql::prelude::Queryable;
use mysql::{params, PooledConn, TxOpts};

//创建路由
pub fn create_route(route: Route, conn: &mut PooledConn) {
    let sql_str = format!(
        "insert into router (label,path,p_key,level) values({:?},{:?},{},{:?})",
        route.label,
        route.path,
        handle_none(&route.p_key, false),
        route.level
    );
    conn.query::<String, String>(sql_str).unwrap();
}

//修改路由
pub fn edit_route(route: Route, conn: &mut PooledConn) -> Result<u8, MyError> {
    let sql_str =
        "update router set label=:label,path=:path,level=:level where router.key=:key;".to_string();
    let mut conn = conn.start_transaction(TxOpts::default()).unwrap();
    let res = conn.exec_first::<String, String, params::Params>(
        sql_str,
        params! {
            "label" => route.label,
            "path" => route.path,
            "level" => route.level,
            "key" => handle_none(&route.key,false)
        },
    );
    match res {
        Ok(_) => {
            let row = conn.affected_rows() as u8;
            conn.commit().unwrap();
            match row {
                1 => Ok(row),
                _ => Err(MyError {
                    name: "no changes happened".to_string(),
                    status: Some(StatusCode::BAD_REQUEST),
                }),
            }
        }
        Err(e) => {
            conn.commit().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}

//获取用户路由表
pub fn get_user_route(aid: u128, conn: &mut PooledConn) -> Result<Vec<Route>, MyError> {
    let sql_str = format!("select r.* from admin_router as ar left join router as r on r.key=ar.rkey where ar.aid={aid}");
    let res: Result<Vec<Route>, mysql::Error> = conn.query(sql_str);
    match res {
        Ok(res) => Ok(res),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

//删除路由
pub fn delete_route(key: &str, conn: &mut PooledConn) -> Result<u8, MyError> {
    let sql_str = format!("delete from router where router.key=:key");
    let mut conn = conn.start_transaction(TxOpts::default()).unwrap();
    let res = conn.exec_first::<String, String, params::Params>(
        sql_str,
        params! {
            "key" => key
        },
    );
    match res {
        Ok(_) => {
            let row = conn.affected_rows() as u8;
            conn.commit().unwrap();
            match row {
                1 => Ok(row),
                _ => Err(MyError {
                    name: "no changes happened".to_string(),
                    status: Some(StatusCode::BAD_REQUEST),
                }),
            }
        }
        Err(e) => {
            conn.commit().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}

//获取所有路由
pub async fn get_all_router(conn: &mut PooledConn) -> Result<Vec<Route>, MyError> {
    let res = conn.query("select * from router order by sort");
    match res {
        Ok(res) => Ok(res),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

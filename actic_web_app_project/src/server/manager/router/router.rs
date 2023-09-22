use crate::app::error::MyError;
use crate::schema::modules::manager::router::router::*;

use actix_web::http::StatusCode;
use mysql::prelude::Queryable;
use mysql::{params, PooledConn, TxOpts};

//创建路由
pub fn create_route(route: UpdateRouteReq, conn: &mut PooledConn) -> Result<u8, MyError> {
    let sql_str =
        format!("insert into router (label,path,p_key,sort,public) values(:label,:path,:p_key,:sort,:public)");
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let res = trans.exec_drop(
        sql_str,
        params! {
            "label" => route.label,
            "path" => route.path,
            "p_key" => route.p_key,
            "sort" => route.sort,
            "public" => route.public
        },
    );
    match res {
        Ok(_) => {
            let row = trans.affected_rows() as u8;
            if row > 0 {
                trans.commit().unwrap();
                Ok(row)
            } else {
                trans.rollback().unwrap();
                Err(MyError::no_changes_happen())
            }
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}

//修改路由
pub fn edit_route(route: UpdateRouteReq, conn: &mut PooledConn) -> Result<u8, MyError> {
    let sql_str =
        "update router set label=:label,path=:path,sort=:sort,public=:public where router.key=:key;".to_string();
    let mut conn = conn.start_transaction(TxOpts::default()).unwrap();
    let res = conn.exec_drop(
        sql_str,
        params! {
            "label" => route.label,
            "path" => route.path,
            "sort" => route.sort,
            "key" => route.key,
            "public" => route.public
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
pub fn get_user_route(role_id: Option<u64>, conn: &mut PooledConn) -> Result<Vec<Route>, MyError> {
    let stmt = "select r.* from router as r where (select count(1) as num from manager_role_router as mrr where mrr.role_id=:role_id)=1 or r.public=1";
    let res: Result<Vec<Route>, mysql::Error> = conn.exec(stmt, params! {"role_id" => role_id});
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
    let res = conn.query("select * from router order by update_time desc");
    match res {
        Ok(res) => Ok(res),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

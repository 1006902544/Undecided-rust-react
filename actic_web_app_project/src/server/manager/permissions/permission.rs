use actix_web::web::Query;
use mysql::{params, prelude::Queryable, PooledConn, TxOpts};

use crate::{
    app::error::MyError,
    nako::connection::{get_current, get_total, handle_none},
    schema::{
        base_struct::{handle_limit, handle_page, LimitResults},
        modules::manager::permission::permission::*,
    },
};

pub async fn get_permission(
    conn: &mut PooledConn,
    query: Query<PermissionLimitQuery>,
) -> Result<LimitResults<Permission>, MyError> {
    let limit = handle_limit(&query.limit);
    let page = handle_page(&query.page);

    let sql_str = format!(
        "select SQL_CALC_FOUND_ROWS * from permissions where (id={id} or {id} is null) and (name like {name} or {name} is null) and (path like {path} or {path} is null) and (method={method} or {method} is null)  order by update_time desc limit {scope},{limit};",
        id = handle_none(&query.id, false),
        name = handle_none(&query.name, true),
        path = handle_none(&query.path, true),
        method = handle_none(&query.method, false),
        scope = limit * (page - 1),
    );

    let res: Result<Vec<Permission>, mysql::Error> = conn.query(sql_str);
    let total = get_total(conn);
    let current = get_current(total, page, limit);

    match res {
        Ok(res) => Ok(LimitResults {
            current,
            total,
            results: Some(res),
        }),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn edit_permission(
    conn: &mut PooledConn,
    body: &UpdatePermissionBody,
) -> Result<String, MyError> {
    if body.id.is_none() {
        return Err(MyError::type_err("".to_string()));
    }
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = format!(
        "update permissions set name=:name,path=:path,method={method},remark=:remark where id={id}",
        // name = body.name,
        // path = handle_none(&body.path, false),
        method = handle_none(&body.method, false),
        id = handle_none(&body.id, false),
        // remark = handle_none(&body.remark, false)
    );
    let res = trans.exec_drop(
        sql_str,
        params! {
            "name" => &body.name,
            "path" => &body.path,
            "remark" => &body.remark
        },
    );

    match res {
        Ok(_) => {
            let affect = trans.affected_rows();
            if affect > 0 {
                trans.commit().unwrap();
                Ok("edit success".to_string())
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

pub async fn create_permission(
    conn: &mut PooledConn,
    body: &UpdatePermissionBody,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = format!(
        "insert into permissions (name,path,method,remark) values('{name}',{path},{method},{remark})",
        name = body.name,
        path = handle_none(&body.path, false),
        method = handle_none(&body.method, false),
        remark = handle_none(&body.remark, false),
    );
    let res = trans.exec_drop(sql_str, ());
    match res {
        Ok(_) => {
            let affect = trans.affected_rows();
            if affect > 0 {
                trans.commit().unwrap();
                Ok("create success".to_string())
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

pub async fn delete_permission(conn: &mut PooledConn, id: u128) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let res = trans.exec_drop(format!("delete from permissions where id={id}"), ());
    match res {
        Ok(_) => {
            let affect = trans.affected_rows();
            if affect > 0 {
                trans.commit().unwrap();
                Ok("delete success".to_string())
            } else {
                trans.rollback().unwrap();
                Err(MyError::delete_err())
            }
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}

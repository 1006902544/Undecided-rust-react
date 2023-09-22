pub mod audit;
pub mod role_permission;
pub mod role_router;

use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{after_update, get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{manager_response::ManagerRoleLimitRes, role::*},
    },
};

pub async fn get_manager_roles(
    conn: &mut PooledConn,
    data: ManagerRoleReq,
) -> Result<ManagerRoleLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_page(&data.page);
    let is_page = match data.is_page {
        Some(is_page) => {
            if is_page != 0 {
                true
            } else {
                false
            }
        }
        None => true,
    };
    if is_page {
        let res = conn.exec("select SQL_CALC_FOUND_ROWS * from roles where (id=:id or :id is null) and (name=:name or :name is null) limit :scope,:limit", params! {
            "id" => data.id,
            "name" => data.name,
            "scope" => limit*(page-1),
            "limit" => limit,
          });
        match res {
            Ok(res) => {
                let total = get_total(conn);
                let current = get_current(total, page, limit);
                Ok(ManagerRoleLimitRes {
                    total,
                    current,
                    results: Some(res),
                })
            }
            Err(e) => Err(MyError::sql_error(e)),
        }
    } else {
        let res = conn.exec("select SQL_CALC_FOUND_ROWS * from roles where (id=:id or :id is null) and (name=:name or :name is null)", params! {
            "id" => data.id,
            "name" => data.name,
            });
        match res {
            Ok(res) => Ok(ManagerRoleLimitRes {
                total: TryInto::<u128>::try_into(res.len()).unwrap(),
                current: 1,
                results: Some(res),
            }),
            Err(e) => Err(MyError::sql_error(e)),
        }
    }
}

pub async fn update_manager_role(
    conn: &mut PooledConn,
    data: ManagerRoleUpdateReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "insert into roles (id,name,icon,remark) values (:id,:name,:icon,:remark) on duplicate key update name=:name,icon=:icon,remark=:remark";
    let res = trans.exec_drop(
        stmt,
        params! {
            "id" => data.id,
            "name" => data.name,
            "icon" => data.icon,
            "remark" => data.remark,
        },
    );
    match after_update(trans, res) {
        Ok(_) => Ok("Update success".to_string()),
        Err(err) => Err(err),
    }
}

pub async fn delete_manager_roles(conn: &mut PooledConn, id: u64) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "delete from roles where id=:id";
    let res = trans.exec_drop(stmt, params! {"id" => id});
    match after_update(trans, res) {
        Ok(_) => Ok("Delete success".to_string()),
        Err(e) => Err(e),
    }
}

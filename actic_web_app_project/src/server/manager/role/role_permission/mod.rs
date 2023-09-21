use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{after_update, get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{
            manager_response::{LimitResults, ManagerRolePermissionRowLimitRes},
            role::role_permission::*,
        },
    },
};

pub async fn get_manager_role_permissions(
    conn: &mut PooledConn,
    data: ManagerRolePermissionRowReq,
) -> Result<ManagerRolePermissionRowLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_page(&data.page);
    let stmt = "select sql_calc_found_rows p.id,p.name,p.path,p.method,
                        if(isnull((select mrp.id from manager_role_permission as mrp where mrp.role_id=:role_id and mrp.permission_id=p.id limit 1)),0,1) status
                        from permissions as p
                        where (p.name=:name or :name is null) and (p.path=:path or :path is null) and (p.method=:method or :method is null)
                        order by p.update_time desc
                        limit :scope,:limit";
    let res = conn.exec::<ManagerRolePermissionRow, _, _>(
        stmt,
        params! {
            "name" => data.name,
            "path" => data.path,
            "method" => data.method,
            "scope" => limit*(page-1),
            "limit" => limit,
            "role_id" => data.role_id,
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(LimitResults {
                total,
                current,
                results: Some(res),
            })
        }
        Err(err) => Err(MyError::sql_error(err)),
    }
}

pub async fn change_role_permission_status(
    conn: &mut PooledConn,
    data: ManagerRolePermissionStatusReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = if data.status == 0 {
        "delete from manager_role_permission where role_id=:role_id and permission_id=:permission_id"
    } else {
        "insert into manager_role_permission (role_id,permission_id) values (:role_id,:permission_id)"
    };
    let res = trans.exec_batch(
        stmt,
        data.permission_ids.into_iter().map(|permission_id| {
            params! {
                "permission_id" => permission_id,
                "role_id" => data.role_id
            }
        }),
    );
    match after_update(trans, res) {
        Ok(_) => Ok("Update success".to_string()),
        Err(e) => Err(e),
    }
}

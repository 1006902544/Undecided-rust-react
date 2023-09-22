use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{after_update, get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{
            manager_response::ManagerRoleRouterRowLimitRes, role::role_router::*,
            router::router::Route,
        },
    },
};

pub async fn get_manager_role_router_limit(
    conn: &mut PooledConn,
    data: ManagerRoleRouterReq,
) -> Result<ManagerRoleRouterRowLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_page(&data.page);
    let stmt = "select r.key,r.label,r.path,r.sort,
                    (if(isnull((select mrr.id from manager_role_router as mrr where mrr.role_id=:role_id and mrr.router_key=r.key limit 1)),0,1)) status
                    from router as r
                    where (r.key=:router_key or :router_key is null) and (r.label=:label or :label is null) and (r.path=:path or :path is null)
                    limit :scope,:limit";
    let res = conn.exec::<ManagerRoleRouterRow, _, _>(
        stmt,
        params! {
          "router_key" => data.router_key,
          "label" => data.label,
          "path" => data.path,
          "role_id" => data.role_id,
          "scope" => limit*(page-1),
          "limit" => limit,
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(ManagerRoleRouterRowLimitRes {
                total,
                current,
                results: Some(res),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn change_manager_role_router_status(
    conn: &mut PooledConn,
    data: ManagerRoleRouterStatusReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = if data.status == 0 {
        "delete from manager_role_router where role_id=:role_id and router_key=:router_key"
    } else {
        "insert into manager_role_router (role_id,router_key) values (:role_id,:router_key) "
    };
    let res = trans.exec_batch(
        stmt,
        data.router_keys
            .into_iter()
            .map(|router_key| params! {"router_key" => router_key,"role_id" => data.role_id}),
    );
    match after_update(trans, res) {
        Ok(_) => Ok("Update success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn get_current_role_router(
    conn: &mut PooledConn,
    role_id: u64,
) -> Result<Vec<Route>, MyError> {
    let res = if role_id == 1 {
        let stmt = "select * from router";
        conn.query(stmt)
    } else {
        let stmt = "select r.* from router as r where (select count(1) as num from manager_role_router as mrr where mrr.role_id=:role_id)=1 or r.public=1";
        conn.exec(
            stmt,
            params! {
                "role_id" => role_id
            },
        )
    };
    match res {
        Ok(res) => Ok(res),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

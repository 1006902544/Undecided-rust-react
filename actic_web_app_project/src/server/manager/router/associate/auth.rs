use mysql::{from_row, params, prelude::Queryable, PooledConn};

use crate::{
    app::error::MyError,
    nako::connection::{get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{manager_response::*, router::associate::auth::*},
    },
};

pub async fn get_auth_with_router_associate(
    conn: &mut PooledConn,
    query: AssociateRouterAuthLimitReq,
) -> Result<RouterAssociateAuthRes, MyError> {
    let limit = handle_limit(&query.limit);
    let page = handle_page(&query.page);
    let sql_str = "select SQL_CALC_FOUND_ROWS id,name,username,age,create_time,update_time,if(id in (select aid from admin_router where rkey=:rkey),true,false) as associated from admin where (id=:id or :id is null) and (name=:name or :name is null) limit :scope,:limit";
    let res: Result<Vec<AssociateRouterAuthLimit>, mysql::Error> = conn.exec_map(
        sql_str,
        params! {
            "rkey" => query.rkey,
            "id" => query.id,
            "name" => query.name,
            "scope" => limit*(page-1),
            "limit" => limit,
        },
        |row| from_row(row),
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(RouterAssociateAuthRes {
                results: Some(res),
                total,
                current,
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

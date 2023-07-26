use mysql::{from_row, prelude::Queryable, PooledConn};

use crate::{
    app::error::MyError,
    nako::connection::{get_current, get_total, handle_none},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{
            manager_response::PermissionAssociateAuthRes, permission::associate::auth::*,
        },
    },
};

// -> Result<PermissionAssociateAuthRes, MyError>
pub async fn get_permission_associate_auth(
    conn: &mut PooledConn,
    query: AssociateAuthLimitReq,
) -> Result<PermissionAssociateAuthRes, MyError> {
    match query.pid.parse::<u128>() {
        Ok(pid) => {
            let limit = handle_limit(&query.limit);
            let page = handle_page(&query.page);
            let sql_str = format!("select SQL_CALC_FOUND_ROWS a.id,a.name,a.username,a.age,a.create_time,a.update_time,if(a.id in (select uid from admin_permissions where permission_id={pid}),true,false) as associated from admin as a where (id={id} or {id} is null) and (name like {name} or {name} is null) order by update_time desc limit {scope},{limit}",
            name = handle_none(&query.name, true),
            id = handle_none(&query.id, false),
            pid = pid,
            scope = limit*(page-1),
            limit = limit
            );
            let res: Result<Vec<AssociateAuthLimit>, mysql::Error> =
                conn.query_map(sql_str, |row| from_row(row));
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            match res {
                Ok(res) => Ok(PermissionAssociateAuthRes {
                    results: Some(res),
                    total,
                    current,
                }),
                Err(e) => Err(MyError::sql_error(e)),
            }
        }
        Err(e) => Err(MyError::type_err(e.to_string())),
    }
}

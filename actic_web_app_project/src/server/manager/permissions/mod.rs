use crate::nako::auth::get_info_by_token;
use actix_web::HttpRequest;
use mysql::{params, prelude::Queryable, PooledConn};
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};

pub mod permission;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct PermissionVerify {
    pub id: u64,
    pub mrp_id: Option<u64>,
}

//has permission
pub fn has_permission(conn: &mut PooledConn, req: &HttpRequest) -> bool {
    match get_info_by_token(req) {
        Some(user_info) => match user_info.role_id {
            Some(role_id) => {
                if role_id == 1 {
                    true
                } else {
                    let path = req.path();
                    let method = req.method().as_str();
                    let stmt = "select p.id,mrp.id as mrp_id from permissions as p left join manager_role_permission as mrp on mrp.role_id=:role_id where p.path=:path and method=:method";
                    let res = conn.exec_first::<PermissionVerify, _, _>(
                        stmt,
                        params! {
                            "path" => path,
                            "method" => method,
                            "role_id" => user_info.role_id
                        },
                    );
                    match res {
                        Ok(res) => match res {
                            Some(res) => match res.mrp_id {
                                Some(_) => true,
                                None => false,
                            },
                            None => false,
                        },
                        Err(_) => false,
                    }
                }
            }
            None => false,
        },
        None => false,
    }
}

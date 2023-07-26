use crate::nako::auth::get_uid_by_token;
use actix_web::HttpRequest;
use mysql::{params, prelude::Queryable, PooledConn};

pub mod associate;
pub mod permission;

//has permission
pub fn has_permission(conn: &mut PooledConn, req: &HttpRequest) -> bool {
    match get_uid_by_token(req) {
        Some(uid) => {
            let path = req.path();
            let method = req.method().as_str();
            let sql_str =
                String::from("select id from permissions where path=:path and method=:method");
            let permission_id: Result<Option<u128>, mysql::Error> = conn.exec_first(
                sql_str,
                params! {
                    "path" => path,
                    "method" => method,
                },
            );
            match permission_id {
                Ok(permission_id) => match permission_id {
                    Some(permission_id) => {
                        let sql_str = String::from(
                                "select id from admin_permissions where uid=:uid and permission_id=:permission_id or uid=:uid and permission_id=1",
                            );
                        let id: Result<Option<u128>, mysql::Error> = conn.exec_first(
                            sql_str,
                            params! {
                                "uid" => uid,
                                "permission_id" => permission_id,
                            },
                        );
                        match id {
                            Ok(id) => match id {
                                Some(_) => true,
                                None => false,
                            },
                            Err(_) => false,
                        }
                    }
                    None => false,
                },
                Err(_) => false,
            }
        }
        None => false,
    }
}

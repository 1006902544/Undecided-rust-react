use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{after_update, get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{manager_response::RoleAuditRowLimitRes, role::audit::*},
    },
};

pub async fn create_role_audit(
    conn: &mut PooledConn,
    data: ApplyRoleReq,
    uid: u64,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "insert into manager_role_audit (id,status,role_id,name,username,email)
        select :id,0,:role_id,mi.name,mi.username,mi.email from (select name,username,email from manager_info where id=:id) as mi
        on duplicate key update status=0,role_id=:role_id
        ";
    let res = trans.exec_drop(stmt, params! {"id" => uid,"role_id" => data.role_id});
    match after_update(trans, res) {
        Ok(_) => Ok("Apply success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn get_current_audit(
    conn: &mut PooledConn,
    uid: u64,
) -> Result<Option<RoleAuditRow>, MyError> {
    let stmt = "select mra.*,r.name as role_name from manager_role_audit as mra
    left join roles as r on r.id=mra.role_id
    where mra.id=:uid";
    let res = conn.exec_first::<RoleAuditRow, _, _>(
        stmt,
        params! {
          "uid" => uid
        },
    );
    match res {
        Ok(res) => Ok(res),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn get_audit_limit(
    conn: &mut PooledConn,
    data: RoleAuditLimitReq,
) -> Result<RoleAuditRowLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_page(&data.page);
    let stmt = "select sql_calc_found_rows mra.*,r.name as role_name from manager_role_audit as mra
    left join roles as r on r.id=mra.role_id
    where (mra.id=:id or :id is null) and (username=:username or :username is null) and (mra.name=:name or :name is null) and (status=:status or :status is null) and (role_id=:role_id or :role_id is null)
    order by update_time desc limit :scope,:limit
    ";
    let res = conn.exec(
        stmt,
        params! {
          "id" => data.id,
          "username" => data.username,
          "name" => data.name ,
          "status" => data.status ,
          "role_id" => data.role_id ,
          "scope" => limit*(page-1),
          "limit" => limit,
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(RoleAuditRowLimitRes {
                total,
                current,
                results: Some(res),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn change_role_audit_status(
    conn: &mut PooledConn,
    data: RoleAuditReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt =
        "update manager_role_audit set status=:status where id=:id and (status=0 or status=1)";
    let res = trans.exec_drop(
        stmt,
        params! {
          "id" => data.id,
          "status" => data.status
        },
    );
    match res {
        Ok(_) => {
            let affect = trans.affected_rows();
            if affect == 0 {
                trans.rollback().unwrap();
                Err(MyError::not_found())
            } else {
                //如果是拒绝
                if data.status == 2 {
                    trans.commit().unwrap();
                    Ok("Update Success".to_string())
                } else {
                    let stmt = "select r.id from manager_role_audit as mra inner join roles as r on mra.role_id=r.id where mra.id=:id";
                    let role_id = trans.exec_first::<u64, _, _>(
                        stmt,
                        params! {
                          "id" => data.id
                        },
                    );
                    match role_id {
                        Ok(role_id) => match role_id {
                            Some(role_id) => {
                                let stmt = "update manager_info set role_id=:role_id,role_name=(select name from roles where id=:role_id) where id=:id";
                                let res = match trans.exec_drop(
                                    stmt,
                                    params! {
                                      "id" => data.id,
                                      "role_id" => role_id
                                    },
                                ) {
                                    Ok(_) => {
                                        trans.commit().unwrap();
                                        Ok("Update Success".to_string())
                                    }
                                    Err(e) => {
                                        trans.rollback().unwrap();
                                        Err(MyError::sql_error(e))
                                    }
                                };
                                res
                            }
                            None => {
                                trans.rollback().unwrap();
                                Err(MyError::not_found())
                            }
                        },
                        Err(e) => {
                            trans.rollback().unwrap();
                            Err(MyError::sql_error(e))
                        }
                    }
                }
            }
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}

pub async fn delete_role_audit(conn: &mut PooledConn, id: u64) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let res = trans.exec_drop(
        "delete from manager_role_audit where id=:id",
        params! {
          "id" => id
        },
    );
    match after_update(trans, res) {
        Ok(_) => Ok("Delete success".to_string()),
        Err(e) => Err(e),
    }
}

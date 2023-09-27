use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{after_update, get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{
            manager_response::ManagerAvatarAuditRowLimitRes, managers::avatar_audit::*,
        },
    },
};

pub async fn get_manager_avatar_audits(
    conn: &mut PooledConn,
    data: ManagerAvatarLimitReq,
) -> Result<ManagerAvatarAuditRowLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_page(&data.page);
    let stmt = "select sql_calc_found_rows maa.*,mi.name,mi.username from manager_avatar_audit as maa
                    left join manager_info as mi on mi.id = maa.id
                    where (maa.id=:id or :id is null) and (maa.status=:status or :status is null)
                        and (mi.username=:username or :username is null) and (mi.name=:name or :name is null)
                    order by maa.update_time desc
                    limit :scope,:limit
                    ";
    let res = conn.exec(
        stmt,
        params! {
          "id" => data.id,
          "username" => data.username,
          "name" => data.name,
          "status" => data.status,
          "scope" => limit*(page-1),
          "limit" => limit,
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(ManagerAvatarAuditRowLimitRes {
                total,
                current,
                results: Some(res),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn manager_avatar_audit(
    conn: &mut PooledConn,
    data: ManagerAvatarAuditReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "update manager_avatar_audit set status=:status,reason=:reason where id=:id";
    match trans.exec_drop(
        stmt,
        params! {"status"=>data.status,"reason" => data.reason,"id" => data.id},
    ) {
        Ok(_) => {
            if data.status == 1 {
                let stmt = "select avatar from manager_avatar_audit where id=:id and status=1";
                match trans.exec_first::<String, _, _>(stmt, params! {"id" => data.id}) {
                    Ok(res) => match res {
                        Some(avatar) => {
                            let stmt = "update manager_info set avatar=:avatar where id=:id";
                            match trans
                                .exec_drop(stmt, params! {"avatar" => avatar,"id" => data.id})
                            {
                                Ok(_) => {
                                    trans.commit().unwrap();
                                    Ok("Update success".to_string())
                                }
                                Err(e) => {
                                    trans.rollback().unwrap();
                                    Err(MyError::sql_error(e))
                                }
                            }
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
            } else {
                trans.commit().unwrap();
                Ok("Update success".to_string())
            }
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}

pub async fn delete_manager_avatar_audit(
    conn: &mut PooledConn,
    data: ManagerAvatarAuditDeleteReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "delete from manager_avatar_audit where id=:id";
    let res = trans.exec_drop(stmt, params! {"id" => data.id});
    match after_update(trans, res) {
        Ok(_) => Ok("Delete success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn manager_avatar_apply(
    conn: &mut PooledConn,
    data: ManagerAvatarApplyReq,
    id: u64,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "insert into manager_avatar_audit (id,avatar) values (:id,avatar) on duplicate key update avatar=:avatar,status=0,reason=null";
    let res = trans.exec_drop(
        stmt,
        params! {
            "id" => id,
            "avatar" => data.avatar
        },
    );
    match after_update(trans, res) {
        Ok(_) => Ok("Update success".to_string()),
        Err(e) => Err(e),
    }
}

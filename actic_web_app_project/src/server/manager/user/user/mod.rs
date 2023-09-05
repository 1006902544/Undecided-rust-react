use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{get_current, get_total},
    schema::{
        base_struct::handle_limit,
        modules::manager::{manager_response::UserLimitRes, user::user::*},
    },
    server::manager::game_center::general::tags::tags::after_update,
};

pub async fn get_user_limit(
    conn: &mut PooledConn,
    data: GetUserLimitReq,
) -> Result<UserLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_limit(&data.page);
    let stmt =
        "select ui.*,case when ub.user_id is null then 0 else 1 end as is_banned from user_info as ui left join user_banned as ub on ub.user_id=ui.id
        where (ui.id=:id or :id is null) and (username=:username or :username is null) and (nickname=:nickname or :nickname is null) and (gender=:gender or :gender is null)
        order by update_time desc limit :scope,:limit";
    let res: Result<Vec<User>, mysql::Error> = conn.exec(
        stmt,
        params! {
          "id" => data.id,
          "username" => data.username,
          "nickname" => data.nickname,
          "gender" => data.gender,
          "scope" => limit*(page-1),
          "limit" => limit,
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(UserLimitRes {
                current,
                total,
                results: Some(res),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn get_user_detail(conn: &mut PooledConn, id: u64) -> Result<UserDetail, MyError> {
    let stmt = "select ui.*,ud.region,ud.email,ud.mobile,
    case when ub.user_id is null then 0 else 1 end as is_banned,ub.banned_date as banned_date,ub.update_time as banned_start_time,ub.reason as banned_reason
    from user_info as ui
    left join user_detail as ud on ud.id=ui.id
    left join user_banned as ub on ub.user_id=ui.id
    where ui.id=:id
    ";
    let res: Result<Option<UserDetail>, mysql::Error> = conn.exec_first(
        stmt,
        params! {
            "id" => id
        },
    );
    match res {
        Ok(res) => match res {
            Some(res) => Ok(res),
            None => Err(MyError::not_found()),
        },
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn banned_user(conn: &mut PooledConn, data: BannedUser) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "insert into user_banned (user_id,banned_date,reason) values (:user_id,:banned_date,:reason) on duplicate key update banned_date=:banned_date,reason=:reason";
    let res = trans.exec_drop(
        stmt,
        params! {
          "user_id" => data.id,
          "banned_date" => data.date,
          "reason" => data.reason,
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("user had been banned".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn unblock_user(conn: &mut PooledConn, user_id: u64) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "delete from user_banned where user_id=:user_id";
    let res = trans.exec_drop(
        stmt,
        params! {
          "user_id" => user_id
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("user had been unblocked".to_string()),
        Err(e) => Err(e),
    }
}

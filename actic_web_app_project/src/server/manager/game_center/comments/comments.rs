use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{get_current, get_total},
    schema::{
        base_struct::handle_limit,
        modules::manager::{game_center::comments::comments::*, manager_response::*},
    },
    server::manager::game_center::general::tags::tags::after_update,
};

pub async fn get_deleted_comment_limit(
    conn: &mut PooledConn,
    data: CommentLimitReq,
) -> Result<CommentLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_limit(&data.page);
    let stmt = "select c.id,c.user_id,c.spu_id,c.content,c.create_time,c.like,c.dislike,c.type as comment_type,c.reply_id,c.reply_uid,ui.username,ui.nickname,s.name as spu_name from comments as c
    left join user_info as ui on ui.id=c.user_id
    left join spus as s on s.id=c.spu_id
    where status='delete' and (c.type=:comment_type or :comment_type is null) and (c.id=:id or :id is null) and (user_id=:user_id or :user_id is null) and (spu_id=:spu_id or :spu_id is null)
    order by create_time desc limit :scope,:limit";
    let res: Result<Vec<Comment>, mysql::Error> = conn.exec(
        stmt,
        params! {
            "id" => data.id,
            "user_id" => data.user_id,
            "spu_id" => data.spu_id,
            "scope" => limit*(page-1),
            "limit" => limit,
            "comment_type" => data.comment_type
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(CommentLimitRes {
                current,
                total,
                results: Some(res),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn get_comment_limit(
    conn: &mut PooledConn,
    data: CommentLimitReq,
) -> Result<CommentLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_limit(&data.page);
    let stmt = "select c.id,c.user_id,c.spu_id,c.content,c.create_time,c.like,c.dislike,c.type as comment_type,c.reply_id,c.reply_uid,ui.username,ui.nickname,s.name as spu_name from comments as c
    left join user_info as ui on ui.id=c.user_id
    left join spus as s on s.id=c.spu_id
    where status='normal' and (c.type=:comment_type or :comment_type is null) and (c.id=:id or :id is null) and (user_id=:user_id or :user_id is null) and (spu_id=:spu_id or :spu_id is null)
    order by create_time desc limit :scope,:limit";
    let res: Result<Vec<Comment>, mysql::Error> = conn.exec(
        stmt,
        params! {
            "id" => data.id,
            "comment_type" => data.comment_type,
            "user_id" => data.user_id,
            "spu_id" => data.spu_id,
            "scope" => limit*(page-1),
            "limit" => limit,
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(CommentLimitRes {
                current,
                total,
                results: Some(res),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn delete_comment_logic(conn: &mut PooledConn, id: u64) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "update comments set status='delete' where id=:id and status='normal'";
    let res = trans.exec_drop(
        stmt,
        params! {
            "id" => id
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("comment has been moved to recycle bin".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn delete_comment_physics(conn: &mut PooledConn, id: u64) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "delete from comments where id=:id and status='delete'";
    let res = trans.exec_drop(
        stmt,
        params! {
            "id" => id
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("delete success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn recover_comment(conn: &mut PooledConn, id: u64) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "update comments set status='normal' where id=:id and status='delete'";
    let res = trans.exec_drop(
        stmt,
        params! {
            "id" => id
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("recover comment success".to_string()),
        Err(e) => Err(e),
    }
}

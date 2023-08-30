use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{after_update, get_current, get_total},
    schema::{
        base_struct::handle_limit,
        modules::manager::{
            game_center::game_management::spu::notice::{
                SpuNotice, SpuNoticeLimitReq, SpuNoticeUpdateReq, SpuNoticeUpdateRes,
            },
            manager_response::SpuNoticeLimitRes,
        },
    },
};

pub async fn create_notice(
    conn: &mut PooledConn,
    data: SpuNoticeUpdateReq,
) -> Result<SpuNoticeUpdateRes, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str =
        "insert into spu_notice (spu_id,title,content,publish_type,publish_time) values (:spu_id,:title,:content,:publish_type,:publish_time)";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "spu_id" => data.spu_id,
            "title" => data.title.clone(),
            "content" => data.content,
            "publish_type" => data.publish_type,
            "publish_time" => data.publish_time,
        },
    );
    match after_update(trans, res) {
        Ok(id) => Ok(SpuNoticeUpdateRes {
            id,
            title: Some(data.title),
        }),
        Err(e) => Err(e),
    }
}

pub async fn edit_notice(
    conn: &mut PooledConn,
    data: SpuNoticeUpdateReq,
) -> Result<SpuNoticeUpdateRes, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str =
        "update spu_notice set spu_id=:spu_id,title=:title,content=:content,publish_type=:publish_type,publish_time=:publish_time where id=:id and update_time>=current_timestamp or id=:id and update_type='manual'";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "spu_id" => data.spu_id,
            "title" => data.title.clone(),
            "content" => data.content,
            "publish_type" => data.publish_type,
            "publish_time" => data.publish_time,
            "id" => data.id,
        },
    );
    match after_update(trans, res) {
        Ok(id) => Ok(SpuNoticeUpdateRes {
            id,
            title: Some(data.title),
        }),
        Err(e) => Err(e),
    }
}

pub async fn delete_notice(conn: &mut PooledConn, id: String) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "delete from spu_notice where id=:id";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "id" => id
        },
    );
    match after_update(trans, res) {
        Ok(_) => Ok(String::from("Delete success")),
        Err(e) => Err(e),
    }
}

pub async fn get_notice_limit(
    conn: &mut PooledConn,
    data: SpuNoticeLimitReq,
) -> Result<SpuNoticeLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_limit(&data.page);
    let sql_str = "select SQL_CALC_FOUND_ROWS * from spu_notation where (spu_id=:spu_id or :spu_id is null) and (id=:id or :id is null) and (title=:title or :title is null) and (publish_type=:publish_type or :publish_type is null) and (published=:published or :published is null) order by update_time desc limit :scope,:limit";
    let res = conn.exec::<SpuNotice, &str, _>(
        sql_str,
        params! {
            "spu_id" => data.spu_id,
            "id" => data.id,
            "title" => data.title,
            "publish_type" => data.publish_type,
            "published" => data.published,
            "scope" => limit*(page-1),
            "limit" => limit,
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(SpuNoticeLimitRes {
                total,
                current,
                results: Some(res),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

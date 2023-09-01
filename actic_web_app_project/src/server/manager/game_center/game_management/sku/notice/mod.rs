use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{after_update, get_current, get_total},
    schema::{
        base_struct::handle_limit,
        modules::manager::{
            game_center::game_management::sku::notice::{
                SkuNotice, SkuNoticeLimitReq, SkuNoticeUpdateReq, SkuNoticeUpdateRes,
            },
            manager_response::SkuNoticeLimitRes,
        },
    },
};

pub async fn create_notice(
    conn: &mut PooledConn,
    data: SkuNoticeUpdateReq,
) -> Result<SkuNoticeUpdateRes, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str =
        "insert into sku_notice (sku_id,title,sku_name,content,publish_type,publish_time) values (:sku_id,:title,:sku_name,:content,:publish_type,:publish_time)";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "sku_id" => data.sku_id,
            "title" => data.title.clone(),
            "content" => data.content,
            "publish_type" => data.publish_type,
            "publish_time" => data.publish_time,
            "sku_name" => data.sku_name,
        },
    );
    match after_update(trans, res) {
        Ok(id) => Ok(SkuNoticeUpdateRes {
            id,
            title: Some(data.title),
        }),
        Err(e) => Err(e),
    }
}

pub async fn edit_notice(
    conn: &mut PooledConn,
    data: SkuNoticeUpdateReq,
) -> Result<SkuNoticeUpdateRes, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str =
        "update sku_notice set title=:title,content=:content,publish_type=:publish_type,publish_time=:publish_time where id=:id and update_time>=current_timestamp or id=:id and update_type='manual'";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "title" => data.title.clone(),
            "content" => data.content,
            "publish_type" => data.publish_type,
            "publish_time" => data.publish_time,
            "id" => data.id,
        },
    );
    match after_update(trans, res) {
        Ok(id) => Ok(SkuNoticeUpdateRes {
            id,
            title: Some(data.title),
        }),
        Err(e) => Err(e),
    }
}

pub async fn delete_notice(conn: &mut PooledConn, id: String) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "delete from sku_notice where id=:id";
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
    data: SkuNoticeLimitReq,
) -> Result<SkuNoticeLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_limit(&data.page);
    let sql_str = "select SQL_CALC_FOUND_ROWS * from sku_notice where (sku_id=:sku_id or :sku_id is null) and (sku_name=:sku_name or :sku_name is null) and (id=:id or :id is null) and (title=:title or :title is null) and (publish_type=:publish_type or :publish_type is null) and (published=:published or :published is null) order by update_time desc limit :scope,:limit";
    let res = conn.exec::<SkuNotice, &str, _>(
        sql_str,
        params! {
            "sku_id" => data.sku_id,
            "id" => data.id,
            "title" => data.title,
            "publish_type" => data.publish_type,
            "published" => data.published,
            "sku_name" => data.sku_name,
            "scope" => limit*(page-1),
            "limit" => limit,
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(SkuNoticeLimitRes {
                total,
                current,
                results: Some(res),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

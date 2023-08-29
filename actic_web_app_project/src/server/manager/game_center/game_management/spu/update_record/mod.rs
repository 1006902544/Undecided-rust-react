use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{after_update, get_current, get_total},
    schema::{
        base_struct::handle_limit,
        modules::manager::{
            game_center::game_management::spu::update_record::*,
            manager_response::SpuUpdateRecordLimitRes,
        },
    },
};

pub async fn create_update_record(
    conn: &mut PooledConn,
    data: UpdateSpuUpdateRecord,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str =
        "insert into spu_update_record (spu_id,title,content) values (:spu_id,:title,:content)";
    let res = trans.exec_drop(
        sql_str,
        params! {
          "spu_id" => data.spu_id,
          "title" => data.title,
          "content" => data.content,
        },
    );
    match after_update(trans, res) {
        Ok(_) => Ok(String::from("Create success")),
        Err(e) => Err(e),
    }
}

pub async fn edit_update_record(
    conn: &mut PooledConn,
    data: UpdateSpuUpdateRecord,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str =
        "update spu_update_record set spu_id=:spu_id,title=:title,content=:content where id=:id";
    let res = trans.exec_drop(
        sql_str,
        params! {
          "spu_id" => data.spu_id,
          "title" => data.title,
          "content" => data.content,
          "id" => data.id,
        },
    );
    match after_update(trans, res) {
        Ok(_) => Ok(String::from("Edit success")),
        Err(e) => Err(e),
    }
}

pub async fn delete_update_record(conn: &mut PooledConn, id: String) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "delete from spu_update_record from where id=:id";
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

pub async fn get_update_record_limit(
    conn: &mut PooledConn,
    data: SpuUpdateRecordLimitReq,
) -> Result<SpuUpdateRecordLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_limit(&data.page);
    let sql_str = "select SQL_CALC_FOUND_ROWS * from spu_update_record from where (spu_id=:spu_id or :spu_id is null) and (id=:id or :id is null) and (title=:title or :title is null) order by update_time desc limit :scope,:limit";
    let res = conn.exec::<SpuUpdateRecord, &str, _>(
        sql_str,
        params! {
          "spu_id" => data.spu_id,
          "id" => data.id,
          "title" => data.title,
          "scope" => limit*(page-1),
          "limit" => limit
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(SpuUpdateRecordLimitRes {
                total,
                current,
                results: Some(res),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

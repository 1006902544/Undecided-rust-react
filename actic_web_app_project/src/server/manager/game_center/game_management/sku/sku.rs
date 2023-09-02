use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{after_update, get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{
            game_center::game_management::sku::sku::*, manager_response::SkuLimitRes,
        },
    },
};

pub async fn create_sku(conn: &mut PooledConn, data: SkuUpdateReq) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "insert into skus (spu_id,name,description,cover_url,cover_name,price,issue_time,spu_name) values (:spu_id,:name,:description,:cover_url,:cover_name,:price,:issue_time,:spu_name)";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "spu_id" => data.spu_id,
            "spu_name" => data.spu_name,
            "name" => data.name,
            "description" => data.description,
            "cover_url" => data.cover_url,
            "cover_name" => data.cover_name,
            "price" => data.price,
            "issue_time" => data.issue_time,
        },
    );
    match after_update(trans, res) {
        Ok(_) => Ok("Create success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn edit_sku(conn: &mut PooledConn, data: SkuUpdateReq) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "update skus set name=:name,description=:description,cover_url=:cover_url,cover_name=:cover_name,price=:price,issue_time=:issue_time) where id=:id";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "id" => data.id,
            "spu_id" => data.spu_id,
            "name" => data.name,
            "description" => data.description,
            "cover_url" => data.cover_url,
            "cover_name" => data.cover_name,
            "price" => data.price,
            "issue_time" => data.issue_time,
        },
    );
    match after_update(trans, res) {
        Ok(_) => Ok("Edit success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn get_sku_limit(
    conn: &mut PooledConn,
    data: SkuLimitReq,
) -> Result<SkuLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_page(&data.page);
    let sql_str = "select * from skus where (spu_id=:spu_id or :spu_id is null) and (spu_name=:spu_name or :spu_name is null) and (id=:id or :id is null) and (name=:name or :name is null) order by update_time desc limit :scope,:limit";
    let res: Result<Vec<Sku>, mysql::Error> = conn.exec(
        sql_str,
        params! {
            "id" => data.id,
            "name" => data.name,
            "spu_id" => data.spu_id,
            "spu_name" => data.spu_name,
            "scope" => limit*(page-1),
            "limit" => limit
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(SkuLimitRes {
                results: Some(res),
                total,
                current,
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn delete_sku(conn: &mut PooledConn, id: String) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "delete from skus where id=:id";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "id" => id
        },
    );
    match after_update(trans, res) {
        Ok(_) => Ok("Delete success".to_string()),
        Err(e) => Err(e),
    }
}

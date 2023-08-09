use mysql::{from_row, prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{after_update, get_current, get_total},
    schema::{
        base_struct::handle_limit,
        modules::manager::{
            game_center::general::types::types::*, manager_response::GameTypeLimitRes,
        },
    },
};

//get game type limit
pub async fn get_game_types(
    conn: &mut PooledConn,
    req: GameTypeLimitReq,
) -> Result<GameTypeLimitRes, MyError> {
    let sql_str = "select * from game_types where (id=:id or :id is null) and (name=:name or :name is null) order by update_time desc limit :scope,:limit";
    let limit = handle_limit(&req.limit);
    let page = handle_limit(&req.page);
    let res: Result<Vec<GameType>, mysql::Error> = conn.exec_map(
        sql_str,
        params! {
            "id"  => req.id,
            "name" => req.name,
            "scope" => limit*(page-1),
            "limit" => limit,
        },
        |row| from_row(row),
    );
    match res {
        Ok(results) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(GameTypeLimitRes {
                current,
                total,
                results: Some(results),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

//create types
pub async fn create_types(
    conn: &mut PooledConn,
    req: UpdateGameTypeReq,
) -> Result<String, MyError> {
    let sql_str =
        "insert into game_types (name,e_tag,logo_url,filename,description) values(:name,:e_tag,:logo_url,:filename,:description)";
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let res = trans.exec_drop(
        sql_str,
        params! {
            "name" => req.name,
            "description" => req.description,
            "e_tag" => req.logo.e_tag,
            "logo_url" => req.logo.url,
            "filename" => req.logo.filename,
        },
    );
    match after_update(trans, res) {
        Ok(_) => Ok("Create Success".to_string()),
        Err(e) => Err(e),
    }
}

//update types
pub async fn update_types(
    conn: &mut PooledConn,
    req: UpdateGameTypeReq,
) -> Result<String, MyError> {
    let sql_str =
        "update game_types set name=:name,e_tag=:e_tag,logo_url=:logo_url,filename=:filename,description=:description where id=:id";
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let res = trans.exec_drop(
        sql_str,
        params! {
            "name" => req.name,
            "description" => req.description,
            "e_tag" => req.logo.e_tag,
            "logo_url" => req.logo.url,
            "filename" => req.logo.filename,
            "id" => req.id,
        },
    );
    match after_update(trans, res) {
        Ok(_) => Ok("Update Success".to_string()),
        Err(e) => Err(e),
    }
}

//delete types
pub async fn delete_types(conn: &mut PooledConn, id: u64) -> Result<String, MyError> {
    let sql_str = "delete from game_types where id=:id";
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let res = trans.exec_drop(
        sql_str,
        params! {
            "id" => id,
        },
    );
    match after_update(trans, res) {
        Ok(_) => Ok("Delete Success".to_string()),
        Err(e) => Err(e),
    }
}

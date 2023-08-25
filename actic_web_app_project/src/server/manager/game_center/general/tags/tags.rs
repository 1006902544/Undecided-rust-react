use mysql::{from_row, prelude::Queryable, PooledConn, Transaction, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{game_center::general::tags::tags::*, manager_response::*},
    },
};

pub async fn get_tags_limit(
    conn: &mut PooledConn,
    query: TagLimitReq,
) -> Result<GameTagsLimitRes, MyError> {
    let limit = handle_limit(&query.limit);
    let page = handle_page(&query.page);
    let sql_str =
        "select SQL_CALC_FOUND_ROWS * from tags where (id=:id or :id is null) and (name like :name or :name is null) order by update_time desc limit :scope,:limit";
    let res = conn.exec_map(
        sql_str,
        params! {
            "id" => query.id,
            "name" => query.name,
            "scope" => limit*(page-1),
            "limit" => limit
        },
        |row| from_row::<Tag>(row),
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(GameTagsLimitRes {
                results: Some(res),
                total,
                current,
            })
        }
        Err(err) => Err(MyError::sql_error(err)),
    }
}

pub async fn update_tags(conn: &mut PooledConn, data: UpdateTagReq) -> Result<u8, MyError> {
    let params = params! {
      "id" => data.id,
      "name" => data.name,
      "description" => data.description,
      "bg_color" => data.bg_color,
      "border_color" => data.border_color,
      "text_color" => data.text_color,
    };
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    match data.id {
        Some(_) => {
            let sql_str = "update tags set name=:name,description=:description,bg_color=:bg_color,border_color=:border_color,text_color=:text_color where id=:id";
            let res = trans.exec_drop(sql_str, params);
            after_update(trans, res).await
        }
        None => {
            let sql_str = "insert into tags (name,description,bg_color,border_color,text_color) values(:name,:description,:bg_color,:border_color,:text_color)";
            let res = trans.exec_drop(sql_str, params);
            after_update(trans, res).await
        }
    }
}

pub async fn after_update(
    trans: Transaction<'_>,
    res: Result<(), mysql::Error>,
) -> Result<u8, MyError> {
    match res {
        Ok(_) => {
            let row = trans.affected_rows() as u8;
            if row > 0 {
                trans.commit().unwrap();
                Ok(row)
            } else {
                trans.rollback().unwrap();
                Err(MyError::no_changes_happen())
            }
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}

pub async fn delete_tags(conn: &mut PooledConn, id: u64) -> Result<u8, MyError> {
    let sql_str = "delete from tags where id=:id";
    let res = conn.exec_drop(
        sql_str,
        params! {
            "id" => id
        },
    );
    match res {
        Ok(_) => {
            let affect = conn.affected_rows() as u8;
            if affect > 0 {
                Ok(affect)
            } else {
                Err(MyError::no_changes_happen())
            }
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn get_tags_list(conn: &mut PooledConn) -> Result<Vec<List>, MyError> {
    let sql_str = "select id as value,name as label from tags";
    let res = conn.query::<List, &str>(sql_str);
    match res {
        Ok(res) => Ok(res),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

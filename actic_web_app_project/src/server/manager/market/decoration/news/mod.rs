use mysql::{prelude::Queryable, PooledConn};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{
            manager_response::{LimitResults, MarketNewsLimitRes},
            market::decoration::news::*,
        },
    },
};

pub async fn get_news(
    conn: &mut PooledConn,
    data: GetNewsReq,
) -> Result<MarketNewsLimitRes, MyError> {
    let stmt = "select * from news where (title like :title or :title is null) limit :scope,:limit";
    let limit = handle_limit(&data.limit);
    let page = handle_page(&data.page);
    match conn.exec::<News, _, _>(
        stmt,
        params! {
            "title" => match data.title {
                Some(title) => format!("%{title}%"),
                None => "null".to_string()
            },
            "limit" => limit,
            "scope" => (page-1)*limit
        },
    ) {
        Ok(res) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(LimitResults {
                total,
                current,
                results: Some(res),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn update_news(conn: &mut PooledConn, data: UpdateNewsReq) -> Result<String, MyError> {
    let stmt: &str;
    let res: Result<(), mysql::Error>;
    match data.id {
        Some(_) => {
            stmt = "update news set title=:title,content=:content,sort=:sort where id=:id";
            res = conn.exec_drop(
                stmt,
                params! {
                    "title" => data.title,
                    "content" => data.content,
                    "id" => data.id,
                },
            )
        }
        None => {
            stmt = "insert into news (title,content,sort) values (:title,:content,:sort)";
            res = conn.exec_drop(
                stmt,
                params! {
                    "title" => data.title,
                    "content" => data.content,
                },
            )
        }
    }
    match res {
        Ok(_) => Ok("Update success".to_string()),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn delete_news(conn: &mut PooledConn, id: u64) -> Result<String, MyError> {
    let stmt = "delete from news where id=:id";
    match conn.exec_drop(
        stmt,
        params! {
            "id" => id
        },
    ) {
        Ok(_) => Ok("Delete success".to_string()),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

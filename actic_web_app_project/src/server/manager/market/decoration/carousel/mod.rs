use mysql::{prelude::Queryable, PooledConn};
use mysql_common::params;

use crate::{app::error::MyError, schema::modules::manager::market::decoration::carousel::*};

pub async fn get_carousel(conn: &mut PooledConn) -> Result<Vec<Carousel>, MyError> {
    let stmt = "select * from market_carousel order by sort";
    match conn.query(stmt) {
        Ok(res) => Ok(res),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn update_carousel(
    conn: &mut PooledConn,
    data: UpdateCarouselReq,
) -> Result<String, MyError> {
    let stmt: &str;
    let res: Result<(), mysql::Error>;
    match data.id {
        Some(_) => {
            stmt = "update market_carousel set cover_url=:cover_url,link_url=:link_url,title=:title,subtitle=:subtitle,content=:content,sort=:sort where id=:id";
            res = conn.exec_drop(
                stmt,
                params! {
                    "cover_url" => data.cover_url,
                    "link_url" => data.link_url,
                    "title" => data.title,
                    "subtitle" => data.subtitle,
                    "content" => data.content,
                    "sort" => data.sort,
                    "id" => data.id,
                },
            );
        }
        None => {
            stmt = "insert into market_carousel (cover_url,link_url,title,subtitle,content,sort) values (:cover_url,:link_url,:title,:subtitle,:content,:sort)";
            res = conn.exec_drop(
                stmt,
                params! {
                    "cover_url" => data.cover_url,
                    "link_url" => data.link_url,
                    "title" => data.title,
                    "subtitle" => data.subtitle,
                    "content" => data.content,
                    "sort" => data.sort,
                },
            );
        }
    }
    match res {
        Ok(_) => Ok("Update success".to_string()),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn delete_carousel(conn: &mut PooledConn, id: u64) -> Result<String, MyError> {
    let stmt = "delete from market_carousel where id=:id";
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

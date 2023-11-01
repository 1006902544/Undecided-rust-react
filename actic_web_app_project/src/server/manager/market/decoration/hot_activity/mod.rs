use mysql::{prelude::Queryable, PooledConn};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{manager_response::LimitResults, market::decoration::hot_activity::*},
    },
};

pub async fn get_hot_activity(
    conn: &mut PooledConn,
    data: GetHotActivityReq,
) -> Result<LimitResults<HotActivity>, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_page(&data.page);
    let stmt = "select a.id,a.cover_url,a.activity_type,ab.price,ap.discount,ha.sort,ha.create_time,ha.update_time from market_hot_activity as ha
                    left join activity_base as a on a.id=ha.id
                    left join activity_bundle as ab on ab.id=a.id
                    left join activity_promotion as ap on ap.id=a.id
                    order by ha.sort
                    limit :scope,:limit
    ";
    match conn.exec(
        stmt,
        params! {
            "scope" => (page-1)*limit,
            "limit" => limit
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

pub async fn update_hot_activity(
    conn: &mut PooledConn,
    data: UpdateHotActivityReq,
) -> Result<String, MyError> {
    let stmt = "insert into market_hot_activity (id,sort) values (:id,:sort) on duplicate key update sort=:sort";
    let res = conn.exec_drop(
        stmt,
        params! {
            "id" => data.id,
            "sort" => data.sort,
        },
    );
    match res {
        Ok(_) => Ok("Update success".to_string()),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn delete_hot_activity(conn: &mut PooledConn, id: u64) -> Result<String, MyError> {
    let stmt = "delete from market_hot_activity where id=:id";
    match conn.exec_drop(
        stmt,
        params! {
          "id" =>id
        },
    ) {
        Ok(_) => Ok("Delete success".to_string()),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

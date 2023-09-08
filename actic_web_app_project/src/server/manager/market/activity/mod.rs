use actix_web::http::StatusCode;
use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{manager_response::*, market::activity::*},
    },
    server::manager::game_center::general::tags::tags::after_update,
};

//activity base
pub async fn update_activity_base(
    conn: &mut PooledConn,
    data: ActivityUpdateStepOneReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "insert into activity_base (title,subtitle,content,cover_url,cover_name,activity_type) values (:title,:subtitle,:content,:cover_url,:cover_name,:bundle) ON DUPLICATE KEY UPDATE id=:id,title=:title,subtitle:=subtitle,content=:content,cover_url=:cover_url,cover_name=:cover_name";
    let res = trans.exec_drop(
        stmt,
        params! {
          "id" => data.id,
          "title" => data.title,
          "subtitle" => data.subtitle,
          "content" => data.content,
          "cover_url" => data.cover_url,
          "cover_name" => data.cover_name,
          "activity_type" => data.activity_type,
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("Update success".to_string()),
        Err(e) => Err(e),
    }
}

//activity info
pub async fn update_activity_info(
    conn: &mut PooledConn,
    data: ActivityUpdateStepTwoReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    match trans.exec_first::<String, &str, _>(
        "select activity_type from activity_base where id=:id",
        params! {
          "id" => data.id
        },
    ) {
        Ok(activity_type) => match activity_type {
            Some(activity_type) => {
                let info_res = if activity_type == "bundle" {
                    let stmt = "insert into activity_bundle (id,price) values (:id,:price) on duplicate key update id=:id,price=:price";
                    let res = trans.exec_drop(
                        stmt,
                        params! {
                          "id" => data.id,
                          "price" => data.price
                        },
                    );
                    match res {
                        Ok(_) => Ok(()),
                        Err(e) => Err(MyError::sql_error(e)),
                    }
                } else if activity_type == "promotion" {
                    let stmt = "insert into activity_promotion (id,discount) values (:id,:discount) on duplicate key update id=:id,discount=:discount";
                    let res = trans.exec_drop(
                        stmt,
                        params! {
                          "id" => data.id,
                          "discount" => data.discount
                        },
                    );
                    match res {
                        Ok(_) => Ok(()),
                        Err(e) => Err(MyError::sql_error(e)),
                    }
                } else {
                    Err(MyError {
                        name: "Unknown activity type".to_string(),
                        status: Some(StatusCode::FORBIDDEN),
                    })
                };
                match info_res {
                    Ok(_) => {
                        let stmt = "insert into activity_publish (publish_type,publish_time,start_time,end_time) values (:publish_type,:publish_time,:start_time,:end_time)
                      on duplicate key update id=:id,publish_type=:publish_type,publish_time=:publish_time,start_time=:start_time,end_time:=end_time";
                        let publish_res = trans.exec_drop(
                            stmt,
                            params! {
                              "id" => data.id,
                              "publish_type" => data.publish_type,
                              "publish_time" => data.publish_time,
                              "start_time" => data.start_time,
                              "end_time" => data.end_time,
                            },
                        );
                        match publish_res {
                            Ok(_) => {
                                trans.commit().unwrap();
                                Ok("Update success".to_string())
                            }
                            Err(e) => {
                                trans.rollback().unwrap();
                                Err(MyError::sql_error(e))
                            }
                        }
                    }
                    Err(e) => {
                        trans.rollback().unwrap();
                        Err(e)
                    }
                }
            }
            None => {
                trans.rollback().unwrap();
                Err(MyError::not_found())
            }
        },
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}

//bundle goods
pub async fn insert_bundle_goods(
    conn: &mut PooledConn,
    data: ActivityBundleInsertGoodsReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "insert into activity_bundle_goods (id,spu_id,spu_name,sku_id,sku_name) values (:id,:spu_id,:spu_name,:sku_id,:sku_name)";
    let res = trans.exec_drop(
        stmt,
        params! {
          "id" => data.id,
          "spu_id" => data.spu_id,
          "spu_name" => data.spu_name,
          "sku_id" => data.sku_id,
          "sku_name" => data.sku_name,
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("Insert goods success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn delete_bundle_goods(
    conn: &mut PooledConn,
    data: ActivityBundleDeleteGoodsReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let res = trans.exec_drop(
        "delete from activity_bundle_goods where id=:id and spu_id=:spu_id and sku_id=:sku_id",
        params! {
          "id" => data.id,
          "spu_id" => data.spu_id,
          "sku_id" => data.sku_id,
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("Delete success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn get_bundle_goods(
    conn: &mut PooledConn,
    data: ActivityGoodsLimitReq,
) -> Result<ActivityGoodsLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_page(&data.page);
    let stmt = "select * from activity_bundle_goods where id=:id and (spu_name=:spu_name or :spu_name is null) and (sku_name=:sku_name or :sku_name is null) limit :scope,:limit";
    let res = conn.exec(
        stmt,
        params! {
          "id" => data.id,
          "spu_name" => data.spu_name,
          "sku_name" => data.sku_name,
          "scope" => limit*(page-1),
          "limit" => limit,
        },
    );
    match res {
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

//promotion goods
pub async fn update_promotion_goods(
    conn: &mut PooledConn,
    data: ActivityPromotionUpdateGoodsReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "insert into activity_promotion_goods (id,spu_id,spu_name,sku_id,sku_name,discount) values (:id,:spu_id,:spu_name,:sku_id,:sku_name,:discount)
    on duplicate key update id=:id,spu_id=:spu_id,sku_id=:sku_id,discount=:discount";
    let res = trans.exec_drop(
        stmt,
        params! {
          "id" => data.id,
          "spu_id" => data.spu_id,
          "spu_name" => data.spu_name,
          "sku_id" => data.sku_id,
          "sku_name" => data.sku_name,
          "discount" => data.discount,
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("Insert goods success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn delete_promotion_goods(
    conn: &mut PooledConn,
    data: ActivityPromotionDeleteGoodsReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let res = trans.exec_drop(
        "delete from activity_promotion_goods where id=:id and spu_id=:spu_id and sku_id=:sku_id",
        params! {
          "id" => data.id,
          "spu_id" => data.spu_id,
          "sku_id" => data.sku_id,
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("Delete success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn get_promotion_goods(
    conn: &mut PooledConn,
    data: ActivityGoodsLimitReq,
) -> Result<ActivityGoodsLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_page(&data.page);
    let stmt = "select * from activity_promotion_goods where id=:id and (spu_name=:spu_name or :spu_name is null) and (sku_name=:sku_name or :sku_name is null) limit :scope,:limit";
    let res = conn.exec(
        stmt,
        params! {
          "id" => data.id,
          "spu_name" => data.spu_name,
          "sku_name" => data.sku_name,
          "scope" => limit*(page-1),
          "limit" => limit,
        },
    );
    match res {
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

//activity detail
pub async fn get_activity_detail(
    conn: &mut PooledConn,
    id: u64,
) -> Result<ActivityDetail, MyError> {
    let stmt_base = "select first(*) from activity_base";
    let base_res: Result<Option<ActivityBaseDetail>, mysql::Error> = conn.exec_first(
        stmt_base,
        params! {
          "id" => id
        },
    );
    match base_res {
        Ok(base_res) => match base_res {
            Some(base_res) => {
                let info_res: Result<Option<ActivityInfoDetail>, mysql::Error> = if base_res
                    .activity_type
                    == "bundle"
                {
                    let info_stmt = "select first(ab.price,ap.publish_type,ap.publish_time,ap.start_time,ap.end_time) from activity_bundle as ab
                    left join activity_publish as ap on ap.id=ab.id where id=:id";
                    conn.exec_first(info_stmt, params! {"id" => id})
                } else {
                    let info_stmt = "select first(apt.discount,ap.publish_type,ap.publish_time,ap.start_time,ap.end_time) from activity_promotion as apt
                  left join activity_publish as ap on ap.id=apt.id where id=:id";
                    conn.exec_first(info_stmt, params! {"id" => id})
                };
                match info_res {
                    Ok(info_res) => Ok(ActivityDetail {
                        base: base_res,
                        info: info_res,
                    }),
                    Err(e) => Err(MyError::sql_error(e)),
                }
            }
            None => Err(MyError::not_found()),
        },
        Err(e) => Err(MyError::sql_error(e)),
    }
}

//get activity limit
pub async fn get_activity_limit(
    conn: &mut PooledConn,
    data: ActivityLimitReq,
) -> Result<ActivityLimitRes, MyError> {
    let limit = handle_limit(&data.limit);
    let page = handle_page(&data.page);
    let stmt = "select first(ab.id,title,subtitle,cover_url,activity_type,create_time,ap.publish_type,ap.publish_time,ap.start_time,ap.end_time) from activity_base as ab
  left join activity_publish as ap on ap.id=ab.id
  where (ab.id=:id or :id is null) and (title=:title or :title is null) and (activity_type=:activity_type or :activity is null)
  limit :scope,:limit";
    let res: Result<Vec<Activity>, mysql::Error> = conn.exec(
        stmt,
        params! {
          "id" => data.id,
          "title" => data.title,
          "activity_type" => data.activity_type,
          "scope" => limit*(page-1),
          "limit" => limit,
        },
    );
    match res {
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

//delete activity
pub async fn delete_activity(conn: &mut PooledConn, id: u64) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "delete from activity_base where id=:id";
    let res = trans.exec_drop(stmt, params! {"id" => id});
    match after_update(trans, res).await {
        Ok(_) => Ok("Delete activity success".to_string()),
        Err(e) => Err(e),
    }
}

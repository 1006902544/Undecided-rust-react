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
) -> Result<u64, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let stmt = "insert into activity_base (id,title,subtitle,content,cover_url,cover_name,activity_type) values (:id,:title,:subtitle,:content,:cover_url,:cover_name,:activity_type) ON DUPLICATE KEY UPDATE title=:title,subtitle=:subtitle,content=:content,cover_url=:cover_url,cover_name=:cover_name";
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
    match res {
        Ok(_) => match data.id {
            Some(id) => {
                trans.commit().unwrap();
                Ok(id)
            }
            None => {
                let id = trans.last_insert_id();
                match id {
                    Some(id) => {
                        trans.commit().unwrap();
                        Ok(id)
                    }
                    None => {
                        trans.rollback().unwrap();
                        Err(MyError::not_found())
                    }
                }
            }
        },
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
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
                        let stmt = "insert into activity_publish (id,publish_type,publish_time,start_time,end_time) values (:id,:publish_type,:publish_time,:start_time,:end_time)
                        on duplicate key update publish_type=:publish_type,publish_time=:publish_time,start_time=:start_time,end_time:=end_time";
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
    let delete_stmt = "delete from activity_bundle_goods where id=:id";
    let delete_res = trans.exec_drop(
        delete_stmt,
        params! {
            "id" => data.id
        },
    );
    match delete_res {
        Ok(_) => {
            let stmt = "insert into activity_bundle_goods (id,spu_id,spu_name,sku_id,sku_name) values (:id,:spu_id,:spu_name,:sku_id,:sku_name)";
            let res = trans.exec_batch(
                stmt,
                data.goods.into_iter().map(|item| {
                    params! {
                        "id" => data.id,
                        "spu_id" => item.spu_id,
                        "spu_name" => item.spu_name,
                        "sku_id" => item.sku_id,
                        "sku_name" => item.sku_name,
                    }
                }),
            );
            match res {
                Ok(_) => {
                    trans.commit().unwrap();
                    Ok("Insert goods success".to_string())
                }
                Err(e) => {
                    trans.rollback().unwrap();
                    Err(MyError::sql_error(e))
                }
            }
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
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
    let stmt = "select sql_calc_found_rows *,null as discount from activity_bundle_goods where id=:id and (spu_name=:spu_name or :spu_name is null) and (sku_name=:sku_name or :sku_name is null)";
    let res = conn.exec(
        stmt,
        params! {
            "id" => data.id,
            "spu_name" => data.spu_name,
            "sku_name" => data.sku_name,
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = 1;
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
    let delete_stmt = "delete from activity_promotion_goods where id=:id";
    match trans.exec_drop(delete_stmt, params! {"id" => data.id}) {
        Ok(_) => {
            let stmt = "insert into activity_promotion_goods (id,spu_id,spu_name,sku_id,sku_name,discount) values (:id,:spu_id,:spu_name,:sku_id,:sku_name,:discount)";
            let res = trans.exec_batch(
                stmt,
                data.goods.into_iter().map(|item| {
                    params! {
                        "id" => data.id,
                        "spu_id" => item.spu_id,
                        "spu_name" => item.spu_name,
                        "sku_id" => item.sku_id,
                        "sku_name" => item.sku_name,
                        "discount" => item.discount,
                    }
                }),
            );
            match after_update(trans, res).await {
                Ok(_) => Ok("Insert goods success".to_string()),
                Err(e) => Err(e),
            }
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
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
    let stmt = "select sql_calc_found_rows * from activity_promotion_goods where id=:id and (spu_name=:spu_name or :spu_name is null) and (sku_name=:sku_name or :sku_name is null)";
    let res = conn.exec(
        stmt,
        params! {
            "id" => data.id,
            "spu_name" => data.spu_name,
            "sku_name" => data.sku_name,
        },
    );
    match res {
        Ok(res) => {
            let total = get_total(conn);
            let current = 1;
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
    let stmt_base = "select * from activity_base where id=:id";
    let base_res: Result<Option<ActivityBaseDetail>, mysql::Error> = conn.exec_first(
        stmt_base,
        params! {
            "id" => id
        },
    );
    match base_res {
        Ok(base_res) => match base_res {
            Some(base_res) => {
                let info_stmt = "select publish_type,publish_time,start_time,end_time,apt.discount,ab.price from activity_publish as ap
                left join activity_bundle as ab on ab.id=ap.id
                left join activity_promotion as apt on apt.id=ap.id
                where ap.id=:id";
                let info_res = conn.exec_first(info_stmt, params! {"id" => id});

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
    let stmt = "select sql_calc_found_rows
    ab.id,ab.title,subtitle,cover_url,activity_type,ab.create_time,ap.publish_type,ap.publish_time,ap.start_time,ap.end_time,if(ha.id is null,false,true) as is_hot
    from activity_base as ab
    left join activity_publish as ap on ap.id=ab.id
    left join market_hot_activity as ha on ha.id = ab.id
    where (ab.id=:id or :id is null) and (ab.title like :title or :title is null) and (activity_type=:activity_type or :activity_type is null)
    limit :scope,:limit";
    let res: Result<Vec<Activity>, mysql::Error> = conn.exec(
        stmt,
        params! {
            "id" => data.id,
            "title" => match data.title {
                Some(title) => Some(format!("%{}%",title)),
                None=> None
            },
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

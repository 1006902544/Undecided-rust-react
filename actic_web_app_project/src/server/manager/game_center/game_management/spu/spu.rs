use chrono::NaiveDateTime;
use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{after_update, get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{
            game_center::game_management::spu::spu::*,
            manager_response::{LimitResults, SpuLimitRes},
        },
    },
};

pub async fn create_spu(conn: &mut PooledConn, params: UpdateSpuReq) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let insert_spu = "insert into spus (name,company_id,price,description,issue_time) values (:name,:company_id,:price,:description,:issue_time)";
    let insert_spu_res = trans.exec_drop(
        insert_spu,
        params! {
            "name" => params.name,
            "company_id" => params.company_id,
            "price" => params.price,
            "description" => params.description,
            "issue_time" => params.issue_time,
        },
    );
    match insert_spu_res {
        Ok(()) => {
            let id = trans.last_insert_id();
            match id {
                Some(id) => {
                    //---存储插入结果，有一个错误就抛出并rollback
                    let mut res_arr = vec![];
                    //---插入封面
                    let insert_cover = "insert into spu_cover (spu_id,cover_url,cover_name) values (:spu_id,:cover_url,:cover_name)";
                    let insert_cover_res = trans.exec_drop(
                        insert_cover,
                        params! {
                            "cover_url" => params.cover.url,
                            "cover_name" => params.cover.name,
                            "spu_id" => id,
                        },
                    );
                    res_arr.push(insert_cover_res);
                    //---插入轮播
                    let insert_carousel = format!(
                        "insert ignore into spu_carousel (spu_id,carousel_url,carousel_name) values (:spu_id,:carousel_url,:carousel_name)",
                    );
                    let insert_carousel_res = trans.exec_batch(
                        insert_carousel,
                        params.carousel.iter().map(|c| {
                            params! {
                                "spu_id" => id,
                                "carousel_url" => c.url.clone(),
                                "carousel_name" => c.name.clone()
                            }
                        }),
                    );
                    res_arr.push(insert_carousel_res);
                    //---插入tags
                    let insert_tags =
                        "insert ignore into spu_tag (spu_id,tag_id,tag_name) values (:spu_id,:tag_id,(SELECT name FROM tags where tags.id=:tag_id limit 1))";
                    let insert_tags_res = trans.exec_batch(
                        insert_tags,
                        params.tag_ids.iter().map(|tag_id| {
                            params! {
                                "tag_id" => tag_id,
                                "spu_id" => id
                            }
                        }),
                    );
                    res_arr.push(insert_tags_res);
                    //---插入types
                    let insert_types =
                        "insert ignore into spu_type (spu_id,type_id,type_name) values (:spu_id,:type_id,(SELECT name FROM types where types.id=:type_id limit 1))";
                    let insert_types_res = trans.exec_batch(
                        insert_types,
                        params.type_ids.iter().map(|type_id| {
                            params! {
                                "type_id" => type_id,
                                "spu_id" => id
                            }
                        }),
                    );
                    res_arr.push(insert_types_res);
                    //---判断结果
                    let mut err = None;
                    res_arr.into_iter().position(|r| match r {
                        Ok(_) => false,
                        Err(e) => {
                            err = Some(e);
                            true
                        }
                    });
                    match err {
                        Some(err) => {
                            trans.rollback().unwrap();
                            Err(MyError::sql_error(err))
                        }
                        None => {
                            trans.commit().unwrap();
                            Ok("Create success".to_string())
                        }
                    }
                }
                None => {
                    trans.rollback().unwrap();
                    Err(MyError::no_changes_happen())
                }
            }
        }
        Err(err) => Err(MyError::sql_error(err)),
    }
}

pub async fn edit_spu(conn: &mut PooledConn, params: UpdateSpuReq) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let insert_spu = "update spus set name=:name,company_id=:company_id,price=:price,description=:description,issue_time=:issue_time where id=:id";
    let insert_spu_res = trans.exec_drop(
        insert_spu,
        params! {
            "name" => params.name,
            "company_id" => params.company_id,
            "price" => params.price,
            "description" => params.description,
            "issue_time" => params.issue_time,
            "id" => params.id.clone()
        },
    );
    match insert_spu_res {
        Ok(()) => {
            //---存储插入结果，有一个错误就抛出并rollback
            let mut res_arr = vec![];
            //---删除
            let deletes = vec![
                "delete from spu_cover where spu_id = :spu_id;",
                "delete from spu_carousel where spu_id = :spu_id;",
                "delete from spu_tag where spu_id = :spu_id;",
                "delete from spu_type where spu_id=:spu_id;",
            ];
            deletes.iter().for_each(|str| {
                let res = trans.exec_drop(
                    str,
                    params! {
                        "spu_id" => params.id.clone(),
                    },
                );
                res_arr.push(res)
            });
            //---插入封面
            let insert_cover = "insert into spu_cover (spu_id,cover_url,cover_name) values (:spu_id,:cover_url,:cover_name)";
            let insert_cover_res = trans.exec_drop(
                insert_cover,
                params! {
                    "cover_url" => params.cover.url,
                    "cover_name" => params.cover.name,
                    "spu_id" => params.id.clone(),
                },
            );
            res_arr.push(insert_cover_res);
            //---插入轮播
            let insert_carousel ="insert ignore into spu_carousel (spu_id,carousel_url,carousel_name) values (:spu_id,:carousel_url,:carousel_name);";
            let insert_carousel_res = trans.exec_batch(
                insert_carousel,
                params.carousel.iter().map(|c| {
                    params! {
                        "spu_id" => params.id.clone(),
                        "carousel_url" => c.url.clone(),
                        "carousel_name" => c.name.clone()
                    }
                }),
            );
            res_arr.push(insert_carousel_res);
            //---插入tags
            let insert_tags = "insert ignore into spu_tag (spu_id,tag_id,tag_name) values (:spu_id,:tag_id,(SELECT name FROM tags where tags.id=:tag_id limit 1))";
            let insert_tags_res = trans.exec_batch(
                insert_tags,
                params.tag_ids.iter().map(|tag_id| {
                    params! {
                        "tag_id" => tag_id.clone(),
                        "spu_id" => params.id.clone()
                    }
                }),
            );
            res_arr.push(insert_tags_res);
            //---插入types
            let insert_types = "insert ignore into spu_type (spu_id,type_id,type_name) values (:spu_id,:type_id,(SELECT name FROM types where types.id=:type_id limit 1))";
            let insert_types_res = trans.exec_batch(
                insert_types,
                params.type_ids.iter().map(|type_id| {
                    params! {
                        "type_id" => type_id,
                        "spu_id" => params.id.clone()
                    }
                }),
            );
            res_arr.push(insert_types_res);
            //---判断结果
            let mut err = None;
            res_arr.into_iter().position(|r| match r {
                Ok(_) => false,
                Err(e) => {
                    err = Some(e);
                    true
                }
            });
            match err {
                Some(err) => {
                    trans.rollback().unwrap();
                    Err(MyError::sql_error(err))
                }
                None => {
                    trans.commit().unwrap();
                    Ok("Create success".to_string())
                }
            }
        }
        Err(err) => Err(MyError::sql_error(err)),
    }
}

pub async fn get_spu_limit(
    conn: &mut PooledConn,
    params: GetSpuLimitReq,
) -> Result<SpuLimitRes, MyError> {
    let limit = handle_limit(&params.limit);
    let page = handle_page(&params.page);
    let sql_str = "
    select sql_calc_found_rows s.id,s.name,s.price,s.issue_time,s.create_time,s.update_time,c.name as company_name,cv.cover_url as cover_url,cv.cover_name as cover_name,group_concat(distinct type.type_name separator ',') as types,group_concat(distinct tag.tag_name separator ',') as tags from spus as s
    left join company_studios as c on c.id=s.company_id
    left join spu_cover as cv on cv.spu_id=s.id
    left join spu_type as type on type.spu_id=s.id
    left join spu_tag as tag on tag.spu_id=s.id
    where (s.id=:id or :id is null) and (s.name=:name or :name is null)
    group by s.id
    order by s.update_time desc
    limit :scope,:limit
    ";
    let res = conn.exec_map::<(
        u64,
        String,
        f64,
        NaiveDateTime,
        NaiveDateTime,
        NaiveDateTime,
        Option<String>,
        String,
        String,
        String,
        String,
    ), &str, _, _, SpuLimit>(
        sql_str,
        params! {
            "scope" => limit*(page-1),
            "limit" => limit,
            "id" => params.id,
            "name" => params.name
        },
        |(
            id,
            name,
            price,
            issue_time,
            create_time,
            update_time,
            company_name,
            cover_url,
            cover_name,
            types,
            tags,
        )| {
            SpuLimit {
                id,
                name,
                price,
                issue_time,
                create_time,
                update_time,
                company_name,
                cover: SpuFileObject {
                    name: cover_name,
                    url: cover_url,
                },
                types: types.split(",").map(|item| item.to_string()).collect(),
                tags: tags.split(",").map(|item| item.to_string()).collect(),
            }
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
        Err(err) => Err(MyError::sql_error(err)),
    }
}

pub async fn get_spu_detail(conn: &mut PooledConn, id: String) -> Result<SpuDetail, MyError> {
    let sql_str = "select s.*,cv.cover_name as cover_name,cv.cover_url as cover_url,concat('[',group_concat(distinct json_object('name', cs.carousel_name,'url', cs.carousel_url)),']') as carousel,group_concat(distinct type.type_id separator ',') as type_ids,group_concat(distinct tag.tag_id separator ',') as tag_ids
    from spus as s
    left join spu_cover as cv on cv.spu_id=s.id
    left join spu_carousel as cs on cs.spu_id=s.id
    left join spu_tag as tag on tag.spu_id=s.id
    left join spu_type as type on type.spu_id=s.id
    where s.id=:id
    group by s.id
    ";
    let res = conn.exec_first::<SpuSqlDetail, &str, _>(sql_str, params! {"id" => id});
    match res {
        Ok(res) => match res {
            Some(res) => {
                let carousel = serde_json::from_value::<Vec<SpuFileObject>>(res.carousel).unwrap();
                let detail = SpuDetail {
                    id: res.id,
                    name: res.name,
                    company_id: res.company_id,
                    price: res.price,
                    cover: SpuFileObject {
                        url: res.cover_url,
                        name: res.cover_name,
                    },
                    carousel,
                    tag_ids: res
                        .tag_ids
                        .split(",")
                        .map(|tag| tag.parse::<String>().unwrap())
                        .collect(),
                    type_ids: res
                        .type_ids
                        .split(",")
                        .map(|tag| tag.parse::<String>().unwrap())
                        .collect(),
                    activity: res.activity,
                    views: res.views,
                    acclaim: res.acclaim,
                    bad_reviews: res.bad_reviews,
                    description: res.description,
                    issue_time: res.issue_time,
                    create_time: res.create_time,
                    update_time: res.update_time,
                };
                Ok(detail)
            }
            None => Err(MyError::not_found()),
        },
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn delete_spu(conn: &mut PooledConn, id: String) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "delete from spus where id=:id";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "id" => id
        },
    );
    let res = after_update(trans, res);
    match res {
        Ok(_) => Ok("Delete success".to_string()),
        Err(e) => Err(e),
    }
}
